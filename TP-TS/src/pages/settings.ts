import { consume } from '@lit/context';
import { LitElement, PropertyValues, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { settingsContext, SettingsController } from '../services/SettingsController';

@customElement('my-settings')
export class SettingsComponent extends LitElement {

  @consume({ context: settingsContext })
  settings!: SettingsController;

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get('title') as string;
    this.settings.updateTitle(title);
  }

  firstUpdated() {
    this.settings.addHost(this);
  }

  render() {
    return html`
      <h1>Settings</h1>
      <p>Welcome to the Settings page!</p>
      <form @submit=${this.handleSubmit}>
        <div>
          <label for="title">App title:</label>
          <input type="text" id="title" name="title" value=${this.settings.state.title} />
        </div>
        <button type="submit">Submit</button>
      </form>
    `;
  }
}
