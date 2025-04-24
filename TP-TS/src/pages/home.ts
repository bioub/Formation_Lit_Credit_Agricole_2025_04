import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('my-home')
export class HomeComponent extends LitElement {

  @state() name = 'Romain';

  handleInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    this.name = input.value;
  }

  render() {
    return html`
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <div>
        <input type="text" placeholder="Enter your name" value=${this.name} @input=${this.handleInput} />
      </div>
      <p>Hello ${this.name}!</p>
    `;
  }
}
