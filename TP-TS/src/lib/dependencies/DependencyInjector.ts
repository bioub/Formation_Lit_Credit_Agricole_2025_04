/**
 * @typedef {string | symbol} Key
 */

export interface DependencyInjectorProvideOptions {
  override?: boolean;
}

/**
 * @export
 * @class DependencyInjector
 * @extends {EventTarget}
 */
export class DependencyInjector<T = any> extends EventTarget {
  dependencies = new Map<keyof T | string | symbol, any>();

  provide<K extends keyof T>(
    key: K | string | symbol, 
    value: T[K] | (() => T[K]) | any, 
    { override = false }: DependencyInjectorProvideOptions = {}
  ): T[K] | any {
    if (this.dependencies.has(key) && override === false) {
      return this.dependencies.get(key);
    }

    if (typeof value === "function" && !(value as any).prototype) {
      value = (value as Function)();
    }

    this.dependencies.set(key, value);

    this.dispatchEvent(
      new CustomEvent("provide-dependency", { detail: value }),
    );

    return value;
  }

  inject<K extends keyof T>(key: K | string | symbol, { throwUnknown = false } = {}): T[K] | any {
    // copy reference for the proxy scope
    const dependencies = this.dependencies;

    const handler = {
      get(_target: any, prop: string | symbol, _receiver: any) {
        if (dependencies.has(key) === false) {
          if (throwUnknown === false) {
            return undefined;
          }

          if (typeof key === "symbol") {
            throw new Error(
              "Missing dependency with symbol: " + key.description,
            );
          }

          throw new Error(`Missing dependency with key: ${String(key)}`);
        }

        const dependency = dependencies.get(key);
        const value = Reflect.get(dependency, prop, dependency);

        return typeof value === "function" ? value.bind(dependency) : value;
      },
      set(_target: any, propertyKey: string | symbol, value: any, _receiver: any) {
        const dependency = dependencies.get(key);
        return Reflect.set(dependency, propertyKey, value, dependency);
      },
    };

    return new Proxy(this.dependencies.get(key) ?? {}, handler);
  }
}
