import { HomeComponent } from './pages/home';
import { SettingsComponent } from './pages/settings';
import { UsersComponent } from './pages/users';

interface Route {
  path: string;
  name: string;
  component: any;
}

export const routes: Route[] = [
  { path: '/', name: 'home', component: HomeComponent },
  { path: '/settings', name: 'settings', component: SettingsComponent },
  {
    path: '/users',
    name: 'users',
    component: UsersComponent,
  },
];
