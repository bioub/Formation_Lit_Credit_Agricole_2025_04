import "./components/top-bar";

import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { di } from "./di";

@customElement("my-app")
export class AppComponent extends LitElement {
  @property({ attribute: false })
  router = di.inject("router");

  static styles = css`
    main {
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <my-top-bar></my-top-bar>
      <main>
        <rlx-flx-router-view .router=${this.router}></rlx-flx-router-view>
      </main>
    `;
  }
}
