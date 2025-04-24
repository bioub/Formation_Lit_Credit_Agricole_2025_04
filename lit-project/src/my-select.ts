import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('my-select')
export class MySelect extends LitElement {
  @property() value: string = '';
  @property({ type: Array }) items: string[] = [];

  @state() private isOpen: boolean = false;

  handleClickSelected() {
    this.isOpen = !this.isOpen;
  }

  handleClickItem(item: string) {
    this.value = item;
    this.isOpen = false;
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: item,
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ATTENTION à flécher la fonction pour ne pas que this soit celui de l'appel (par window)
  handleWindowClick = (event: MouseEvent) => {
    // console.log(event.target); // ATTENTION, ne traverse pas le shadow DOM
    // console.log(event.composedPath()[0]); // traverse le shadow DOM

    // Le click a eu lieu à l'intérieur de l'élément
    if (this.shadowRoot?.contains(event.composedPath()[0] as Node)) {
      return;
    }

    this.isOpen = false;
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('click', this.handleWindowClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('click', this.handleWindowClick);
  }

  openMenu() {
    this.isOpen = true;
  }

  closeMenu() {
    this.isOpen = false;
  }

  render() {
    return html`
      <div class="selected" @click=${this.handleClickSelected}>${this.value}</div>
      ${this.isOpen
        ? html`<div class="menu">
            ${this.items.map(
              (item) => html`
                <div
                  class="menu-item"
                  @click=${() => this.handleClickItem(item)}
                >
                  ${item}
                </div>
              `,
            )}
          </div>`
        : nothing}
    `;
  }

  static styles = css`
    * {
      box-sizing: border-box;
    }
    .selected {
      background-color: #f0f0f0;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      min-width: 300px;
      cursor: pointer;
    }
    .menu {
      position: absolute;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-top: 5px;
      min-width: 300px;
    }
    .menu-item {
      padding: 10px;
      cursor: pointer;
    }
  `;
}
