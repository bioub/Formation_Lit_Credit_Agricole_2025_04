import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-users-filter")
export class UsersFilterComponent extends LitElement {
  render() {
    return html`
      <input
        type="text"
        placeholder="Filter users"
      />
    `;
  }
  
  static styles = css`
    input {
      box-sizing: border-box;
      width: 100%;
      padding: 0.5em;
      margin-bottom: 1em;
    }
  `;
}
