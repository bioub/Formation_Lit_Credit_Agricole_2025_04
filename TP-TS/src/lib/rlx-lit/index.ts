import type { LitElement as OriginalLitElement, ReactiveController } from "lit";

export class Controller extends EventTarget implements ReactiveController {
  /**
   * Set of LitElement hosts that this controller is attached to
   */
  hosts: Set<OriginalLitElement> = new Set();

  /**
   * Add a host element to this controller
   * @param host - The LitElement host to add
   */
  addHost(host: OriginalLitElement): void {
    this.hosts.add(host);
    host.addController(this);
  }

  /**
   * Remove a host element from this controller
   * @param host - The LitElement host to remove
   */
  removeHost(host: OriginalLitElement): void {
    host.removeController(this);
    this.hosts.delete(host);
  }

  /**
   * Request an update on all host elements
   */
  requestUpdate(): void {
    this.hosts.forEach((host) => host.requestUpdate());
  }

  // Required ReactiveController interface methods
  hostConnected?(): void;
  hostDisconnected?(): void;
  hostUpdate?(): void;
  hostUpdated?(): void;
  
  // Dummy methods for compatibility with LitElement
  addController(): void {}
  removeController(): void {}
  updateComplete: Promise<boolean> = new Promise(() => true);
}

export class Store extends Controller {}

/**
 * Mixin that adds self-controlling capabilities to a LitElement class
 */
export const SelfControlledMixin = <T extends new (...args: any[]) => OriginalLitElement>(
  superClass: T
) =>
  class extends superClass {
    /** Array of controllers managed by this element */
    controllers: Controller[] = [];

    connectedCallback(): void {
      super.connectedCallback();

      this.controllers.forEach((controller) => {
        controller.addHost(this);
      });
    }

    disconnectedCallback(): void {
      this.controllers.forEach((controller) => {
        controller.removeHost(this);
      });

      // Handle legacy P property if it exists
      const thisAny = this as any;
      if (thisAny.P) {
        thisAny.P.forEach((controller: any) => {
          controller?.removeHost?.(this);
        });
      }

      super.disconnectedCallback();
    }
  };
