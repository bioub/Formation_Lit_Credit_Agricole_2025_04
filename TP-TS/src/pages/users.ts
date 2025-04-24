import '../components/users-filter';

import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { di } from '../di';

interface User {
  id: number;
  name: string;
}

@customElement('my-users')
export class UsersComponent extends LitElement {
  @property({ attribute: false })
  router = di.inject('router');

  @property({ type: String })
  searchTerm = '';

  @property({ type: Array })
  users: User[] = [
    { id: 1, name: 'Pierre' },
    { id: 2, name: 'Paul' },
    { id: 3, name: 'Jacques' },
  ];

  @state()
  filter = '';

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
    this.filter = event.detail;
  }

  render() {
    return html`
      <div class="left">
        <my-users-filter></my-users-filter>
        <nav>
          ${this.users.map((user) => html`<a class="${classMap({active: user.id % 2 === 0})}" href="#"> ${user.name} </a>`)}
        </nav>
      </div>
      <div class="right">
        
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
