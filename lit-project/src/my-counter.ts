import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("my-counter")
export class MyCounter extends LitElement {
  @state()
  _count = 0;

  render() {
    return html`
      <button @click=${this.increment}>Count: ${this._count}</button>
    `;
  }

  increment(event: PointerEvent) {
    console.log('x:', event.clientX);
    console.log('y:', event.clientY);
    
    this._count++;
  }
}