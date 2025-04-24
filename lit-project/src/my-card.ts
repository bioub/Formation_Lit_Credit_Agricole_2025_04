import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-card")
export class MyCard extends LitElement {

  @property({ type: String })
  title = "My Card Title";

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        background-color: var(--my-card-background-color, white);
        border-radius: 8px;
        box-shadow: var(--my-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      }
    `;
  }

  render() {
    return html`
      <div>
        <h1>${this.title}</h1>
        <slot></slot>
      </div>
    `;
  }
}