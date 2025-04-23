import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';


@customElement('my-hello')
export class MyHello extends LitElement {
  // static properties = {
  //   name: { type: String },
  // };

  @property({ reflect: true, attribute: 'nom-de-famille' })
  nomDeFamille: string = 'Toto';

  @state()
  _count = 0;

  render() {
    return html`<h1>Hello, ${this.nomDeFamille}!</h1>`;
  }
}

// customElements.define('my-hello', MyHello);