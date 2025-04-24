import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-form")
export class MyForm extends LitElement {

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name");
    console.log("Form submitted with name:", name);
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />
        <button type="submit">Submit</button>
      </form>
    `;
  }
}