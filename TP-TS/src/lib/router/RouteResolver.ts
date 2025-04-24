import { findRouteByQuery, generateUrls } from "./route";
import { Router } from "./Router";
import type { RouterConfiguration, NormalizedRoute, Route, Query } from "./types.d";

/**
 * Class responsible for resolving routes and managing navigation.
 *
 * @export
 * @class RouteResolver
 * @extends {EventTarget}
 */
export class RouteResolver extends EventTarget {
  /**
   * The array of route definitions
   */
  routes: Route[];

  /**
   * Whether to use browser history API
   */
  useHistory: boolean;

  /**
   * Whether to use local storage to remember the last route
   */
  useMemory: boolean;

  /**
   * Current URL
   */
  url?: string;

  /**
   * Current active route
   */
  route!: NormalizedRoute;

  /**
   * Generated URL objects
   */
  urls!: NormalizedRoute[];

  /**
   * Array of routers managed by this resolver
   */
  routers: Router[];

  /**
   * Gets the current path of the resolved route.
   */
  get path(): string {
    return this.route?.path;
  }

  /**
   * Creates an instance of RouteResolver.
   *
   * @constructor
   * @param configuration - The router configuration.
   */
  constructor({ routes, useHistory, useMemory, entry }: RouterConfiguration) {
    super();

    this.useHistory = useHistory ?? false;
    this.useMemory = useMemory ?? false;
    this.routers = [];
    this.routes = [];
    this.setRoutes(routes ?? []);

    if (this.useMemory && localStorage.getItem("route")) {
      const storedRoute = localStorage.getItem("route");
      if (storedRoute) {
        this.to(storedRoute);
      }
    } else if (entry) {
      this.to(entry);
    }

    if (this.useHistory) {
      window.addEventListener("popstate", (event) => {
        if (event.state === null) {
          return;
        }
        if (event.state) {
          this.to(event.state, true);
        }
      });
    }
  }

  /**
   * Navigates to a specified route based on the query.
   * Does not register the route using history or memory. If you want to use 'push' instead.
   *
   * @param query - The query data to find the route.
   * @param isBack - Indicates if the navigation is a back action in the history.
   *
   * @example
   * resolver.to({ url: '/about' });
   */
  to(query: Query, isBack = false): void {
    try {
      const route = findRouteByQuery(this.urls, query);
      this.setRoute(route, isBack, false);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Navigates to a specified route based on the query.
   *
   * @param query - The query data to find the route.
   * @param isBack - Indicates if the navigation is a back action in the history.
   *
   * @example
   * resolver.to({ url: '/about' });
   */
  push(query: Query, isBack = false): void {
    try {
      const route = findRouteByQuery(this.urls, query);
      this.setRoute(route, isBack, true);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Sets the current route and optionally updates history and memory.
   *
   * @param route - The normalized route to set.
   * @param isBack - Indicates if the navigation is a back action in the history.
   * @param isPush - Whether to use push navigation (update history)
   */
  setRoute(route: NormalizedRoute, isBack = false, isPush = true): void {
    this.route = route;

    this.routers.forEach((router) => router.setRoute(route));

    if (isPush === false) {
      return;
    }

    if (this.route && this.useHistory && isBack === false) {
      // Modifié par Romain pour la formation :
      history.pushState({url: this.route.url}, "", this.route.url);
      // history.pushState(this.route.url, "");
    }

    if (this.useMemory) {
      localStorage.setItem("route", this.route.url);
    }
  }

  /**
   * Sets the routes and generates the corresponding URLs for navigation.
   *
   * @param routes - The array of route configurations.
   */
  setRoutes(routes: Route[]): void {
    this.routes = routes;
    this.#buildUrls(this.routes);
  }

  /**
   * Builds normalized URLs from the provided routes.
   *
   * @param routes - The array of route configurations.
   */
  #buildUrls(routes: Route[]): void {
    this.urls = generateUrls(routes);
  }
}

export const routeResolverKey = "global-route-resolver";
