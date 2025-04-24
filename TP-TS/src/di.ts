import { DependencyInjector } from './lib/dependencies/DependencyInjector';
import { Router } from './lib/router';
import { routes } from './routes';

// Déclaration d'interface pour DependencyInjector
interface IDependencyInjector {
  provide: (key: string, value: any) => void;
  inject: <T>(key: string) => T;
}

export const di = new DependencyInjector() as IDependencyInjector;

di.provide('router', new Router({
  routes: routes,
  useHistory: true,
}));
