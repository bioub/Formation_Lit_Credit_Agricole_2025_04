import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-settings')
export class SettingsComponent extends LitElement {
  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
  }

  render() {
    return html`
      <h1>Settings</h1>
      <p>Welcome to the Settings page!</p>
      <form @submit=${this.handleSubmit}>
        <div>
          <label for="title">App title:</label>
          <input type="text" id="title" name="title" />
        </div>
        <button type="submit">Submit</button>
      </form>
    `;
  }
}
