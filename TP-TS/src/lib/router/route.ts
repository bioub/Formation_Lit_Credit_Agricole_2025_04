import { getDuplicates } from "../core/index";
import type { NormalizedRoute, Route, Query } from "./types.d";

const QUERY_PARAMETER_CHARACTER_IDENTIFIER = ":";

/**
 * Generates URLs for the provided routes and checks for duplicate paths or names.
 *
 * @param routes - The array of routes to process.
 * @returns The array of normalized routes.
 * @throws {DuplicateRouteError} - If there are duplicate paths or names.
 */
export function generateUrls(routes: Route[]): NormalizedRoute[] {
  const normalizedRoutes = fuseRoutesPaths(routes).map((route) =>
    buildRouteName(route),
  );

  const duplicatePath = getDuplicates(normalizedRoutes, (route) => route.path);

  if (duplicatePath.length > 0) {
    throw new DuplicateRouteError("path", duplicatePath[0].path);
  }

  const duplicateNames = getDuplicates(
    normalizedRoutes.filter((route) => route.name !== undefined),
    (route) => route.name as string,
  );

  if (duplicateNames.length > 0) {
    throw new DuplicateRouteError("name", duplicateNames[0].name as string);
  }

  return normalizedRoutes;
}

/**
 * Fuses routes and their paths recursively.
 *
 * @param routes - The array of routes to process.
 * @param fragments - The route fragments.
 * @param path - The base path.
 * @returns The array of fused routes.
 */
export function fuseRoutesPaths(routes: Route[], fragments: Route[] = [], path: string = ""): NormalizedRoute[] {
  return routes.flatMap((fragment) => {
    let newPath = "";

    if (path === "") {
      newPath = fragment.path;
    } else if (fragment.path === "") {
      newPath = path;
    } else {
      newPath = `${path}/${fragment.path}`;
    }

    newPath = cleanUpPath(newPath);

    if (fragment.children) {
      return fuseRoutesPaths(
        fragment.children,
        [...fragments, fragment],
        newPath,
      );
    }

    return [{
      ...fragment,
      path: newPath,
      routes: [...fragments, fragment],
      parameters: {},
      url: newPath
    }];
  });
}

/**
 * Builds route names by keeping the last encountered names.
 *
 * @param route - The route to process.
 * @returns The modified route.
 */
function buildRouteName(route: NormalizedRoute): NormalizedRoute {
  // keep only last encountered names
  route.routes.forEach((r) => {
    if (r.name !== undefined) route.name = r.name;
  });

  return route;
}

/**
 * Cleans up the path by removing duplicate slashes and trailing slashes.
 *
 * @param path - The path to clean up.
 * @returns The cleaned-up path.
 */
function cleanUpPath(path: string): string {
  // Utiliser replace avec regex au lieu de replaceAll (ES2021)
  path = path.replace(/\/\//g, "/");

  if (path[path.length - 1] === "/" && path.length > 1) {
    path = path.slice(0, -1);
  }

  return path;
}

/**
 * Finds a route by query, either by URL or by name and parameters.
 *
 * @param routes - The array of normalized routes.
 * @param query - The query (URL or name with parameters) to find the route.
 * @returns The matching route, if any.
 */
export function findRouteByQuery(routes: NormalizedRoute[], query: Query): NormalizedRoute {
  if (typeof query === "string") {
    return findRouteByUrl(routes, query);
  }

  const { url, name, parameters } = query;

  if (url !== undefined) {
    return findRouteByUrl(routes, url);
  }

  if (name !== undefined) {
    // Utiliser une assertion de type pour s'assurer que parameters est bien un Record<string, string>
    return findRouteByName(routes, name, parameters as Record<string, string> | undefined);
  }

  throw new Error("Invalid query: must have url or name");
}

const paramRe = /^:(.+)/;

/**
 * Splits a URI into its individual segments.
 *
 * @param uri - The URI to segmentize.
 * @returns The array of URI segments.
 */
function segmentize(uri: string): string[] {
  return uri.replace(/(^\/+|\/+$)/g, "").split("/");
}

/**
 * Finds a route by URL.
 *
 * @param routes - The array of normalized routes.
 * @param url - The URL to find the route.
 * @returns The matching route, if any.
 * @throws {UnknownUrl} - If the URL does not match any route.
 */
export function findRouteByUrl(routes: NormalizedRoute[], url: string): NormalizedRoute {
  let match: NormalizedRoute | undefined;
  const [uriPathname] = url.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "/";

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routeSegments = segmentize(route.path);
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;
    let missed = false;
    let parameters: Record<string, string> = {};
    for (; index < max; index++) {
      const uriSegment = uriSegments[index];
      const routeSegment = routeSegments[index];
      const fallback = routeSegment === "*";
      if (fallback) {
        parameters["*"] = uriSegments
          .slice(index)
          .map(decodeURIComponent)
          .join("/");
        break;
      }
      if (uriSegment === undefined) {
        missed = true;
        break;
      }
      let dynamicMatch = paramRe.exec(routeSegment);
      if (dynamicMatch && !isRootUri) {
        let value = decodeURIComponent(uriSegment);
        parameters[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        missed = true;
        break;
      }
    }
    if (!missed) {
      match = { ...route, parameters };
      break;
    }
  }

  if (match === undefined) {
    throw new UnknownUrl(url, routes);
  }

  match.url = url;

  return match;
}

/**
 * Finds a route by name and optional parameters.
 *
 * @param routes - The array of normalized routes.
 * @param name - The name of the route.
 * @param parameters - The parameters for the route.
 * @returns The matching route, if any.
 * @throws {UnknownName} - If the name does not match any route.
 */
export function findRouteByName(
  routes: NormalizedRoute[],
  name: string,
  parameters?: Record<string, string>
): NormalizedRoute {
  const urls = routes.filter((route) =>
    route.routes.some((f) => f.name === name),
  );

  if (parameters === undefined && urls.length > 0) {
    const route = urls[0];
    route.url = route.path;
    return urls[0];
  }

  const parameterRegex = new RegExp(
    `(${QUERY_PARAMETER_CHARACTER_IDENTIFIER}\\w+)`,
    'g'
  );

  const route = urls.find((route) => {
    let path = cleanUpPath(route.path);
    let rePath = cleanUpPath(route.path);

    const matches = [...route.path.matchAll(parameterRegex)];
    matches.forEach((match) => {
      const param = match[0];
      rePath = route.path.replace(
        param,
        `(?<${param.replace(QUERY_PARAMETER_CHARACTER_IDENTIFIER, "")}>\\w+)`,
      );
    });

    const re = new RegExp(rePath);

    if (parameters) {
      Object.entries(parameters).forEach(([key, value]) => {
        path = path.replace(QUERY_PARAMETER_CHARACTER_IDENTIFIER + key, value);
      });
    }

    const result = path.match(re);
    if (result?.groups) {
      route.parameters = result.groups as Record<string, string>;
    }

    if (result !== null) {
      // S'assurer que result.input est défini
      route.url = result.input || '';
    }

    return result !== null;
  });

  if (route === undefined) {
    throw new UnknownName(name);
  }

  return route;
}

/**
 * Error thrown when duplicate routes are found
 */
export class DuplicateRouteError extends Error {
  /**
   * @constructor
   * @param identifier - The type of identifier that's duplicated
   * @param value - The duplicated value
   */
  constructor(identifier: "path" | "name", value: string) {
    super(`Duplicated identifiers '${identifier}' = '${value}'`);
  }
}

/**
 * Error thrown when a URL can't be found
 */
export class UnknownUrl extends Error {
  /**
   * @constructor
   * @param url - The URL that couldn't be found
   * @param routes - The available routes
   */
  constructor(url: string, routes: NormalizedRoute[]) {
    const urls = routes.map((route) => route.url).join(", ");
    super(`Could not find route with the following url: '${url}' in ${urls}`);
  }
}

/**
 * Error thrown when a route name can't be found
 */
export class UnknownName extends Error {
  /**
   * @constructor
   * @param name - The name that couldn't be found
   */
  constructor(name: string) {
    super(`Could not find route with the following name: '${name}'`);
  }
}
