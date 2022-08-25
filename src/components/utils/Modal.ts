import createNode from './createNode';

export class Modal {
  closeBtn: HTMLButtonElement;

  modalContent: HTMLDivElement;

  overLay: HTMLDivElement;

  constructor() {
    this.closeBtn = createNode({ tag: 'button', classes: ['btn', 'modal-close-btn'] }) as HTMLButtonElement;
    this.modalContent = createNode({ tag: 'div', classes: ['modal-wrapper'] }) as HTMLDivElement;
    this.overLay = createNode({ tag: 'div', classes: ['modal-overlay'] }) as HTMLDivElement;
  }

  renderModal(htmlNode: HTMLElement) {
    this.modalContent.innerHTML = '';
    this.closeBtn.innerHTML = '<span class="material-icons-outlined material-modal-close-icon">close</span>';
    this.modalContent.append(htmlNode);
    this.modalContent.prepend(this.closeBtn);
    this.overLay.append(this.modalContent);
    document.body.append(this.overLay);
    document.body.classList.add('hidden-overflow');
    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', this.closeModal.bind(this));
    this.overLay.addEventListener('click', this.closeModal.bind(this));
  }

  closeModal(e: Event) {
    const classes = (e.target as HTMLElement).classList;
    if (classes.contains('modal-overlay') || classes.contains('modal-close-btn') || classes.contains('material-modal-close-icon')) {
      this.overLay.remove();
      document.body.classList.remove('hidden-overflow');
    }
  }

  exitModal() {
    this.overLay.remove();
    document.body.classList.remove('hidden-overflow');
  }

  showMessage(data: string) {
    this.modalContent.innerHTML = '';
    const p = createNode({ tag: 'p', classes: ['modal-message'], inner: `${data}` });
    this.modalContent.append(p);
    return this.modalContent;
  }
}
