import '../components/users-filter';

import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';

import { di } from '../di';
import { UsersController } from '../services/UsersController';

interface User {
  id: number;
  name: string;
}

@customElement('my-users')
export class UsersComponent extends LitElement {
  @state()
  router = di.inject('router');

  @state()
  searchTerm = '';

  @state()
  users: User[] = [
    { id: 1, name: 'Pierre' },
    { id: 2, name: 'Paul' },
    { id: 3, name: 'Jacques' },
  ];

  usersController = new UsersController(this);

  handleClick(event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLAnchorElement) {
      // Typage explicite pour éviter l'erreur unknown
      const router = this.router as any;
      router.push(event.target.pathname);
      this.requestUpdate();
    }
  }

  handleFilterChanged(event: CustomEvent) {
    this.searchTerm = event.detail;
  }

  handleLinkClick(event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLAnchorElement) {
      // Typage explicite pour éviter l'erreur unknown
      const router = this.router as any;
      router.push(event.target.pathname);
    }
  }


  render() {
    return html`
      <div class="left">
        <my-users-filter
          filter=${this.searchTerm}
          @filter-changed=${this.handleFilterChanged}
        ></my-users-filter>
        <nav>
          <!-- ${this.users
            .filter((user) =>
              user.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
            )
            .map(
              (user) =>
                html`<a
                  class="${classMap({ active: user.id % 2 === 0 })}"
                  href="#"
                >
                  ${user.name}
                </a>`,
            )} -->
          ${repeat(
            this.users.filter((user) =>
              user.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
            ),
            (user) => user.id,
            (user) =>
              html`<a
                class="${classMap({ active: user.id % 2 === 0 })}"
                href=${user.id}
                @click=${this.handleLinkClick}
              >
                ${user.name}
              </a>`,
          )}
        </nav>
      </div>
      <div class="right">
        <rlx-flx-router-view></rlx-flx-router-view>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      gap: 1rem;
    }

    .left a {
      cursor: pointer;
      display: block;
      padding: 0.5rem;
      text-decoration: none;
      color: black;
    }

    .left a.active {
      background-color: var(--my-bg-color, lightblue);
    }
  `;
}
