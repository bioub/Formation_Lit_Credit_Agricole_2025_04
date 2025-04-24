import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-list')
export class MyList extends LitElement {
  @property({ type: Array })
  items: string[] = [];

  // handleClick(item: string) {
  //   this.dispatchEvent(
  //     new CustomEvent('select-change', {
  //       detail: item,
  //       bubbles: true,
  //       composed: true,
  //     })
  //   );
  // }

  // render() {
  //   return html`
  //     <ul>
  //       ${this.items.map(
  //         (item) =>
  //           html`<li @click=${() => this.handleClick(item)}>${item}</li>`,
  //       )}
  //     </ul>
  //   `;
  // }

  // Avec Event Delegation (on écoute l'événement sur le parent au lieu de chaque enfant)
  handleClick(event: PointerEvent) {
    // console.log(event.currentTarget); // toujours ul (là où on a mis @click)
    // console.log(event.target); // là où on a cliqué (li ou ul dans cet exemple)

    const target = event.target as HTMLElement;
    
    if (target.classList.contains('menu-item')) {
      const item = target.dataset.menuItem;
      this.dispatchEvent(
        new CustomEvent('select-change', {
          detail: item,
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <ul @click=${this.handleClick}>
        ${this.items.map(
          (item) =>
            html`<li class="menu-item" data-menu-item=${item}>${item}</li>`,
        )}
      </ul>
    `;
  }
}
