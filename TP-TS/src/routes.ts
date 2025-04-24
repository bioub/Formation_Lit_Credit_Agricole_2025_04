import { HomeComponent } from './pages/home';
import { SettingsComponent } from './pages/settings';
import { UserDetailsComponent } from './pages/user-details';
import { UsersComponent } from './pages/users';
import { html } from 'lit';

interface Route {
  path: string;
  name: string;
  component?: any;
  children?: Route[];
  render?: () => any;
}

export const routes: Route[] = [
  { path: '/', name: 'home', component: HomeComponent },
  { path: '/settings', name: 'settings', component: SettingsComponent },
  {
    path: '/users',
    name: 'users',
    component: UsersComponent,
    children: [
      {path: '', name: 'users-index', render: () => html`<p>Select a user from the list</p>`},
      {path: ':userId', name: 'user-detail', component: UserDetailsComponent},
    ],
  },
];
