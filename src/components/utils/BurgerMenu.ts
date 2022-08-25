export class BurgerMenu {
  burgerMenu = document.querySelector('.burger-icon') as HTMLElement;

  menu = document.querySelector('.header-menu') as HTMLElement;

  menuLinks = document.querySelectorAll<HTMLElement>('.menu-item');

  initBurgerMenu() {
    this.bindEvents.bind(this);
    this.bindEvents();
  }

  openMenu() {
    this.burgerMenu.classList.add('clicked');
    this.menu.classList.add('opened');
    // overlay.classList.add('shadowed');
    document.body.classList.add('hidden-overflow');
  }

  closeMenu() {
    this.burgerMenu.classList.remove('clicked');
    this.menu.classList.remove('opened');
    // overlay.classList.remove('shadowed');
    document.body.classList.remove('hidden-overflow');
  }

  bindEvents() {
    this.burgerMenu.addEventListener('click', () => {
      if (this.burgerMenu.classList.contains('clicked')) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    });
    this.menu.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      console.log(123);
      if (target.classList.contains('menu-item') || target.closest('.menu-item')) {
        console.log(e.target);
        this.closeMenu();
      }
    });
  }
}
