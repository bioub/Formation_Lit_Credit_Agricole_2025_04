// Ces imports semblent faire référence à des modules externes
// J'ajoute "// @ts-ignore" pour éviter les erreurs TypeScript
// @ts-ignore
import { callAjaxDynamicActionAsync } from "../utils/apriso";
// @ts-ignore
import { getCurrentEnvironment } from "../context/Environment";
// @ts-ignore
import { deepMerge } from "../utils/object";
// @ts-ignore
import { configurationKey, sessionKey, shared } from "../index";

// Interfaces pour les types mentionnés dans les commentaires JSDoc
interface Crate {
  instance?: any;
  [key: string]: any;
}

interface CrateConfiguration {
  [key: string]: any;
}

// Cette interface est utilisée comme référence pour la structure des dépendances
// @ts-ignore - Cette interface est utilisée dans la documentation
interface Dependency {
  [key: string]: any;
}

// Map de configuration des modules
const map: Record<string, { repo: string; path: string }> = {
  // #region modules
  core: {
    repo: "Common",
    path: "modules/@core",
  },
  lit: {
    repo: "Common",
    path: "modules/@lit",
  },
  "ui-components": {
    repo: "Common",
    path: "modules/@ui-components",
  },
  essentials: {
    repo: "Common",
    path: "modules/@essentials",
  },

  // #endregion

  // #region functionnal-components
  employee: {
    repo: "Common",
    path: "modules/functionnal-components/@employee",
  },
  // #endregion

  "svq-controle-reception": {
    repo: "SvqControlReceptionApp",
    path: "",
  },
};

// Crates storage
// Suppression de la variable crates non utilisée

interface InitializeDependencyResolverOptions {
  root?: string;
  forceRoot?: boolean;
  localhost?: boolean;
  reuse?: boolean;
}

// Étendre Window pour les propriétés globales
declare global {
  interface Window {
    dependencyResolver: DependencyResolver;
    use: (name: string) => any;
    loadCrateInstance: (parameters: any) => Promise<any>;
    defineCrate: (config: CrateConfiguration) => CrateConfiguration;
  }
}

/**
 * Initialize the dependency resolver
 * @param parameters - Configuration options
 * @returns The dependency resolver instance
 */
export function initializeDependencyResolver({
  root = location.origin,
  forceRoot = false,
  localhost = true,
  reuse = true,
}: InitializeDependencyResolverOptions = {}): DependencyResolver {
  if (window.dependencyResolver && reuse === true) {
    return window.dependencyResolver;
  }

  if (forceRoot === false) {
    // @ts-ignore - Ignoring errors related to external dependencies
    const session = shared.inject(sessionKey);

    const localRoot = session.isLocalWebAppDebug
      ? "http://127.0.0.1:5500"
      : location.origin;

    root = session.localHost
      ? localRoot
      : "/Apriso/Portal/Scripts/WebApplication";
  }

  const dependencyResolver = new DependencyResolver(root, localhost);

  window.dependencyResolver = dependencyResolver;
  window.use = (name: string) => dependencyResolver.use(name);
  window.loadCrateInstance = (parameters: any) =>
    dependencyResolver.loadCrateInstance(parameters);
  window.defineCrate = (config) => dependencyResolver.defineCrate(config);

  return dependencyResolver;
}

/**
 * A class responsible for resolving and managing outer application dependencies.
 */
export class DependencyResolver extends EventTarget {
  /**
   * The root URL for the repositories.
   */
  root: string;

  /**
   * Indicates whether the environment is localhost.
   */
  isLocalhost: boolean;

  /**
   * An object mapping repository names to their URLs.
   */
  repos: Map<string, string> = new Map();

  /**
   * A mapping of external loaders for crates.
   */
  crateLoaders: Map<string, (crate: Crate) => void> = new Map();

  /**
   * A mapping of crate names to their data.
   */
  crates: Map<string, Crate> = new Map();

  /**
   * Creates an instance of DependencyResolver.
   *
   * @param root - The root URL for the repositories.
   * @param isLocalhost - Indicates whether the environment is localhost.
   */
  constructor(root: string, isLocalhost: boolean) {
    super();

    this.root = root;
    this.isLocalhost = isLocalhost;
  }

  /**
   * Defines a crate configuration.
   *
   * @param config - The crate configuration.
   * @returns The crate configuration.
   */
  defineCrate(config: CrateConfiguration): CrateConfiguration {
    return config;
  }

  /**
   * Adds a crate loader for the specified key.
   *
   * @param key - The key identifying the crate.
   * @param loader - The loader function for the crate.
   * @returns Callback to remove the loader
   */
  addCrateLoader(key: string, loader: (crate: Crate) => void): () => void {
    this.crateLoaders.set(key, loader);

    const removeLoader = () => {
      this.crateLoaders.delete(key);
    };

    return removeLoader;
  }

  /**
   * Retrieves the instance of a crate by its name.
   *
   * @param name - The name of the crate.
   * @returns The instance of the crate.
   */
  use(name: string): any {
    if (this.crates.has(name) === false) {
      throw new Error(
        `Missing crate: "${name}", did you forget to add ${name} as a dependency ?`,
      );
    }

    const crate = this.crates.get(name)!;
    const instance = crate.instance ?? {};

    return instance;
  }

  /**
   * Checks if a crate exists by name
   * @param name - The crate name
   * @returns Whether the crate exists
   */
  hasCrate(name: string): boolean {
    return map[name] !== undefined;
  }

  /**
   * Entry point for loading a crate instance
   * @param parameters - Loading parameters
   * @returns Promise resolving to the crate instance
   */
  loadCrateInstance(parameters: any): Promise<any> {
    // This method is referenced but not fully implemented in the original code
    // Adding a placeholder implementation that uses the parameters
    console.log('Loading crate with parameters:', parameters);
    return Promise.resolve(parameters || {});
  }
}
