import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import './my-hello.js';
import './my-list.js'

import './my-counter.js'
import './my-card.js'
import './my-tabs.js'
import './my-tab.js'

@customElement("my-app")
export class MyApp extends LitElement {
  constructor() {
    super();
  }

  @state()
  name = 'Romain';

  names = ['Toto', 'Tata', 'Titi'];

  handleSelectChange(event: CustomEvent) {
    this.name = event.detail;
  }

  handleClick(event: PointerEvent) {
    console.log(event.target); // ne traverse pas le shadow DOM
    console.log(event.composedPath()); // chemin complet depuis l'élément cliqué jusqu'à l'élément racine
    console.log(event.composedPath()[0]); // équivalent à event.target mais qui traverse le shadow DOM
  }

  render() {
    return html`
      <div @click=${this.handleClick} @select-change=${this.handleSelectChange}>
        <h1>Hello, LitElement!</h1>
        <p>This is a simple LitElement component.</p>
        <my-hello nom-de-famille=${this.name}></my-hello>
        <my-hello .nomDeFamille=${this.name}></my-hello>
        <my-list .items=${this.names} ></my-list>
        <my-counter></my-counter>
        <my-card title="My Text Title">
          <my-counter></my-counter>
        </my-card>

        <my-tabs name="Romain">
          <my-tab label="Tab 1">
            <p>Content for Tab 1</p>
          </my-tab>
          <my-tab label="Tab 2">
            <p>Content for Tab 2</p>
          </my-tab>
        </my-tabs>
      </div>
    `;
  }
}
