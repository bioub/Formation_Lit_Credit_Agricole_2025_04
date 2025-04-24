import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-tab')
export class MyTab extends LitElement {
  @property()
  label = 'Tab';

  render() {
    return html`
      <div class="tab" @click=${() => this.dispatchEvent(new CustomEvent('select-change', { detail: this.label, bubbles: true, composed: true }))}>
        <slot></slot>
      </div>
    `;
  }
}
