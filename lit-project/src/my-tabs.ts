import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { MyTab } from "./my-tab";

@customElement("my-tabs")
export class MyTabs extends LitElement {
  static get styles() {
    return [
      // css`
      //   :host {
      //     display: block;
      //     padding: 16px;
      //     background-color: var(--my-card-background-color, white);
      //     border-radius: 8px;
      //     box-shadow: var(--my-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      //   }
      // `,
    ];
  }

  @property()
  name = '';

  @state()
  tabsLabel: string[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    // TODO removeEventListener dans disconnectedCallback
    this.addEventListener('select-change', (event) => {
      const selectedTab = (event as CustomEvent).detail;
      console.log(`Selected tab: ${selectedTab}`);
    });
  }

  firstUpdated(): void {
    this.tabsLabel = this.shadowRoot?.querySelector('slot')?.assignedNodes().filter(node => node instanceof MyTab).map((node) => node.label) ?? [];
  }

  willUpdate(): void {
    this.tabsLabel = this.shadowRoot?.querySelector('slot')?.assignedNodes().filter(node => node instanceof MyTab).map((node) => node.label) ?? [];
  }

  render() {
    return html`
      <div class="tabs">
        ${this.tabsLabel.map((label) => html`<button class="tab">${label}</button>`)}
      </div>
      <div class="tab-content">
        <slot></slot>
      </div>
        `;
  }
}