import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { di } from "../di";
import { consume } from "@lit/context";
import { settingsContext, SettingsController } from "../services/SettingsController";

@customElement("my-top-bar")
export class TopBarComponent extends LitElement {
  @property({ attribute: false })
  router = di.inject("router");

  @consume({ context: settingsContext })
  settings!: SettingsController;

  handleClick(event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLAnchorElement) {
      // Typage explicite pour éviter l'erreur unknown
      const router = this.router as any;
      router.push(event.target.pathname);
    }
  }

  firstUpdated() {
    this.settings.addHost(this);
  }

  render() {
    return html`
      <h1>${this.settings.state.title}</h1>
      <nav>
        <a href="/" @click=${this.handleClick}>Home</a>
        <a href="/settings" @click=${this.handleClick}>Settings</a>
        <a href="/users" @click=${this.handleClick}>Users</a>
      </nav>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--my-bg-color, lightblue);
      padding: 1rem;
    }

    h1 {
      margin: 0;
    }

    a {
      color: black;
      text-decoration: none;
      margin-right: 1rem;
    }

    a:hover {
      text-decoration: underline;
    }
  `;
}
