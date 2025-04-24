import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-users-filter')
export class UsersFilterComponent extends LitElement {
  @property() filter = '';

  handleInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    this.filter = input.value;
    this.dispatchEvent(
      new CustomEvent('filter-changed', {
        detail: this.filter,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <input
        type="text"
        placeholder="Filter users"
        value=${this.filter}
        @input=${this.handleInput}
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
