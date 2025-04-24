import { LitElement, PropertyValues, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import './my-hello.js';
import './my-list.js'

import './my-counter.js'
import './my-card.js'
import './my-tabs.js'
import './my-tab.js'
import './my-select.js'
import { MySelect } from "./my-select.js";
import { createRef, ref } from "lit/directives/ref.js";

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

  mySelect = createRef<MySelect>();

  firstUpdated() {
    // this.mySelect = this.shadowRoot?.querySelector('my-select') as MySelect;
    this.mySelect?.value?.openMenu();
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

        <my-select value=${this.name} .items=${this.names} @value-change=${this.handleSelectChange}></my-select>
        <my-select ${ref(this.mySelect)} value=${this.name} .items=${this.names} @value-change=${this.handleSelectChange}></my-select>
        <my-select value=${this.name} .items=${this.names} @value-change=${this.handleSelectChange}></my-select>
      </div>
    `;
  }
}
