import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import './my-hello.js';
import './my-list.js'

@customElement("my-app")
export class MyApp extends LitElement {
  constructor() {
    super();
  }

  name = 'Romain';

  names = ['Toto', 'Tata', 'Titi'];

  render() {
    return html`
      <div>
        <h1>Hello, LitElement!</h1>
        <p>This is a simple LitElement component.</p>
        <my-hello nom-de-famille=${this.name}></my-hello>
        <my-hello .nomDeFamille=${this.name}></my-hello>
        <my-list .items=${this.names}></my-list>
      </div>
    `;
  }
}
