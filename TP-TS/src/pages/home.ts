import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-home')
export class HomeComponent extends LitElement {
  render() {
    return html`
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
    `;
  }
}
