import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { di } from '../di';

@customElement('my-user-details')
export class UserDetailsComponent extends LitElement {
  @property({ attribute: false })
  router = di.inject('router');

  render() {
    return html`
      <h2>Toto</h2>
      <p>Email: toto@company.com</p>
      <p>Phone: +41 00 111 22 33</p>
    `;
  }

  static styles = css`
    h2 {
      margin-top: 0;
    }
  `;
}
