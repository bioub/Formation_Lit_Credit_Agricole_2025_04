import { Controller } from "../rlx-lit/index";
import { RouteResolver } from "./RouteResolver";
import { RouterView } from "./RouterView";
import type { RouterConfiguration, NormalizedRoute, Route, Query } from "./types.d";

/**
 * Class responsible for managing routing, including navigation and route resolution.
 *
 * ```js
 * const routerConfig = {
 *     routes: [
 *         { path: '/home', name: 'home', component: HomeComponent },
 *         { path: '/about', name: 'about', component: AboutComponent },
 *     ],
 *     useHistory: true,
 *     useMemory: true,
 *     entry: { url: '/home' }
 * };
 * const router = new Router(routerConfig);
 * ```
 *
 * @export
 * @class Router
 * @extends Controller
 *
 */
export class Router extends Controller {
  /**
   * The route resolver instance used by this router.
   */
  resolver: RouteResolver;

  /**
   * The RouterView instance associated with this router.
   */
  view?: RouterView;

  /**
   * The subpath used by this router when acting as a sub-router.
   */
  subpath?: string;

  /**
   * Indicates whether to use local routing.
   */
  useLocal = false;

  /**
   * @param parameters - The router configuration parameters.
   */
  constructor(parameters: RouterConfiguration) {
    super();

    this.useLocal = parameters.useLocal || false;

    this.resolver = new RouteResolver(parameters);
    this.resolver.routers.push(this);

    // Modifié par Romain
    this.resolver.to(location.pathname);
  }

  /**
   * Gets the current normalized route.
   */
  get route(): NormalizedRoute {
    return this.resolver.route;
  }

  /**
   * Gets the list of all routes.
   */
  get routes(): Route[] {
    return this.resolver.routes;
  }

  /**
   * Checks if this router is a sub-router.
   */
  get isSubRouter(): boolean {
    return this.subpath !== undefined;
  }

  /**
   * Gets the current path of the router.
   */
  get path(): string {
    return this.isSubRouter && this.subpath
      ? this.resolver.path.replace(this.subpath, "")
      : this.resolver.path;
  }

  /**
   * Navigates to the specified query.
   * Does not register the route using history or memory. If you want to use 'push' instead.
   *
   * @param query - The query to navigate to.
   *
   * @example
   * router.to({ url: '/about' });
   * router.to('/home');
   */
  to(query: Query): void {
    if (this.isSubRouter) {
      if (typeof query === "string") {
        query = this.subpath + query;
      } else if (query.url !== undefined) {
        query.url = this.subpath + query.url;
      }
    }

    this.resolver.to(query);
  }

  /**
   * Navigates to the specified query.
   *
   * @param query - The query to navigate to.
   *
   * @example
   * router.to({ url: '/about' });
   * router.to('/home');
   */
  push(query: Query): void {
    if (this.isSubRouter) {
      if (typeof query === "string") {
        query = this.subpath + query;
      } else if (query.url !== undefined) {
        query.url = this.subpath + query.url;
      }
    }

    this.resolver.push(query);
  }

  /**
   * Sets the current route and updates the RouterView.
   *
   * @param route - The normalized route to set.
   */
  setRoute(route: NormalizedRoute): void {
    this.view?.setRoute(route);
    this.requestUpdate();

    this.dispatchEvent(new CustomEvent("resolve-route", { detail: route }));
  }

  /**
   * Registers this router as a sub-router of the given parent router.
   *
   * @param parentRouter - The parent router to register with.
   */
  registerAsSubRouter(parentRouter: Router): void {
    this.subpath = parentRouter.path;
  }

  /**
   * Resets all routes, computes the new ones, and refreshes the navigation to the current path.
   *
   * @param routes - The array of new route configurations.
   */
  setRoutes(routes: Route[]): void {
    this.resolver.setRoutes(routes);
    this.to(this.route.path);
    this.view?.requestUpdate();
  }
}
