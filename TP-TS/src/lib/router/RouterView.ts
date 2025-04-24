import { LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { NormalizedRoute, Route } from "./types.d";
import { Router } from "./Router";

/**
 * RouterView component used to render routes based on the router configuration.
 *
 * @export
 * @class RouterView
 * @extends {LitElement}
 */
@customElement("rlx-flx-router-view")
export class RouterView extends LitElement {
  @property({ attribute: false })
  router?: Router;

  @property({ attribute: false })
  renderProperties: Record<string, any> = {};

  @property({ attribute: false })
  route?: NormalizedRoute;

  /**
   * The parent RouterView instance.
   */
  parent?: RouterView;

  /**
   * The child RouterView instance.
   */
  child?: RouterView;

  constructor() {
    super();
    this.renderProperties = {};
  }

  /**
   * Checks if this RouterView is the root view.
   */
  get isRoot(): boolean {
    return this.parent === undefined;
  }

  /**
   * Gets the index of this RouterView in the hierarchy.
   */
  get index(): number {
    return this.isRoot === true ? 0 : (this.parent?.index ?? -1) + 1;
  }

  /**
   * Gets the current fragment route for this RouterView.
   */
  get fragment(): Route | undefined {
    if (this.router === undefined) {
      return undefined;
    }

    return this.#getFragmentRoute(this.router?.route, this.index);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.parent = this.#getAncestor();

    if (this.router === undefined) {
      if (this.parent === undefined) {
        console.error("Missing router attribute to RouterView");
        return;
      }

      this.router = this.parent.router;
      this.parent.child = this;
    } else {
      if (this.parent === undefined || this.router.useLocal === true) {
        this.router.view = this;
        this.parent = undefined;
      } else {
        if (this.parent.router !== this.router) {
          this.router.view = this;
          this.parent = undefined;
        } else {
          this.parent.child = this;
        }
      }
    }

    this.setRoute(this.router!.route);
  }

  render() {
    if (this.fragment === undefined) {
      return nothing;
    }

    if (this.fragment.component) {
      // component is a function and not a class, that means it hasn't finished loading
      if (typeof this.fragment.component === 'function' && 
          /^\s*class/.test(this.fragment.component.toString()) === false) {
        return nothing;
      }

      // If component is a class constructor
      if (typeof this.fragment.component === 'function') {
        return new (this.fragment.component as new () => HTMLElement)();
      }
    }

    if (typeof this.fragment.render === 'function') {
      return this.fragment.render(this.renderProperties);
    }
    
    return nothing;
  }

  /**
   * Sets the route for this RouterView.
   *
   * @param route - The route to set.
   */
  setRoute(route: NormalizedRoute): void {
    if (
      this.#getFragmentRoute(this.route, this.index)?.path ===
        this.#getFragmentRoute(route, this.index)?.path &&
      this.child !== undefined
    ) {
      this.child.setRoute(route);
      return;
    }

    const routesBellow = this.#getFragmentRoutesBellow(this.route, this.index);
    [...routesBellow].reverse().forEach(r => {
      if (r.onBeforeLeave) r.onBeforeLeave();
    });
    
    this.route = route;

    if (this.#loadFragmentComponent() === false) {
      if (this.fragment?.onBeforeEnter) {
        this.fragment.onBeforeEnter();
      }
      this.requestUpdate();
    }
  }

  /**
   * Gets the fragment route at a given index.
   *
   * @param route - The normalized route.
   * @param index - The index to get the fragment route.
   * @return The fragment route, if any.
   */
  #getFragmentRoute(route?: NormalizedRoute, index: number = 0): Route | undefined {
    if (route === undefined || route.routes.length <= index) {
      return undefined;
    }

    return route.routes[index];
  }

  /**
   * Gets all fragment routes below a given index.
   *
   * @param route - The normalized route.
   * @param index - The index to get the fragment routes below.
   * @return The array of fragment routes below the index.
   */
  #getFragmentRoutesBellow(route?: NormalizedRoute, index: number = 0): Route[] {
    if (route === undefined || route.routes.length <= index) {
      return [];
    }

    return route.routes.reduce<Route[]>(
      (acc, route, routeIndex) => (index <= routeIndex ? [...acc, route] : acc),
      [],
    );
  }

  /**
   * Gets the ancestor RouterView.
   *
   * @param node - The node to start the search from.
   * @returns The ancestor RouterView, if any.
   */
  #getAncestor(node: Node = this): RouterView | undefined {
    const parent = node.parentNode || (node as any).host;

    if (!parent) {
      return undefined;
    }

    if (parent instanceof RouterView) {
      return parent;
    }

    return this.#getAncestor(parent);
  }

  /**
   * Loads the fragment component, if it is not already loaded.
   *
   * @returns true if the component is being loaded, false otherwise.
   */
  #loadFragmentComponent(): boolean {
    if (
      this.fragment &&
      this.fragment.component &&
      typeof this.fragment.component === 'function' &&
      /^\s*class/.test(this.fragment.component.toString()) === false
    ) {
      // Handle dynamic import
      (this.fragment.component as () => Promise<any>)().then((module) => {
        // take the first exported class from the module
        if (this.fragment) {
          // Utiliser une assertion de type pour corriger l'erreur de type 'unknown'
          const componentClass = Object.values(module).filter(
            (value): value is (new (...args: any[]) => HTMLElement) => 
              typeof value === 'function' && /^\s*class/.test(value.toString()) === true
          )[0];
          
          this.fragment.component = componentClass;

          if (this.fragment.onBeforeEnter) {
            this.fragment.onBeforeEnter();
          }
          this.requestUpdate();
        }
      });

      return true;
    }

    return false;
  }
}
