import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-list")
export class MyList extends LitElement {
  @property({ type: Array })
  items: string[] = [];

  render() {
    return html`
      <ul>
        ${this.items.map(item => html`<li>${item}</li>`)}
      </ul>
    `;
  }
}