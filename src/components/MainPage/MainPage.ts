import createNode from '../utils/createNode';

export class MainPage {
  renderMain() {
    const container: HTMLElement = document.querySelector('.main') as HTMLElement;
    container.innerHTML = '';
    const template = createNode({ tag: 'div', classes: ['main-section'], inner: `${this.makePage()}` });
    container.append(template);
    return container;
  }

  makePage() {
    const template = `<section class="hero-section">
    <h1 class="hero-section-header">Learn Engish and play</h1>
    <p class="hero-section-text">Some text about this cool and great and perfect app goes here may be some words about the rules and the text book and games or about that there are 6 level, but you may get statistic and 7th level after registration</p>
    <button class="video-btn btn-secondary"><span class="material-icons-outlined video-icon">play_circle_filled</span>как учиться</button>
      <section class="advantages-section">
      <div class="advantage_wrapper">
        <img src="./assets/books.jpg" alt="Преимущество - учебник с более чем 3600 слов" class="advantage-image">
        <h2 class="advantage-header">Учебник</h2>
        <p class="advantage-text">Более 3000 слов разделенных на 6 уровней сложности</p>
      </div>
      <div class="advantage_wrapper">
        <img src="./assets/games.jpg" alt="Преимущество - интерактивные игры для изучения слов" class="advantage-image">
        <h2 class="advantage-header">Игры</h2>
        <p class="advantage-text">Интерактивные игры для легкого изучения слов</p>
      </div>
      <div class="advantage_wrapper">
        <img src="./assets/progress.jpg" alt="Преимущество - отслеживание прогресса" class="advantage-image">
        <h2 class="advantage-header">Прогресс</h2>
        <p class="advantage-text">Зарегистрируйса и отлеживай свой прогресс каждый день</p>
      </div>
      <div class="advantage_wrapper">
        <img src="./assets/vocab.jpg" alt="Преимущество - cловарь со сложными словами" class="advantage-image">
        <h2 class="advantage-header">Словарь</h2>
        <p class="advantage-text">Сохраняй слова в словарь, чтобы выучить их позже</p>
      </div>
    </section>
  </section>
  <section class="team-section">
    <h2 class="team-section-header">Наша команда</h2>
    <p class="team-section-text">Мы старались:)</p>
    <div class="team-members">
      <div class="team-member">
        <img src="./assets/sveta-photo.jpg" alt="" class="team-member-img">
        <h3 class="team-member-name">Светлана</h3>
        <p class="member-duty">Team lead, developer, designer</p>
        <div class="member-actions">
          <ul>
            <li>Учебник</li>
            <li>Регистрация / Авторизация</li>
            <li>Главная страница</li>
          </ul>
        </div>
        <a class="git-icon" href="https://github.com/svetarachok" target="_blank"></a>
      </div>
      <div class="team-member">
        <img src="./assets/evgen-photo.jpg" alt="" class="team-member-img">
        <h3 class="team-member-name">Евгений</h3>
        <p class="member-duty">Developer, designer</p>
        <div class="member-actions">
          <ul>
            <li>Роутер - маршрутизация страниц</li>
            <li>Игра Спринт</li>
        </div>
        <a class="git-icon" href="https://github.com/Parxommm" target="_blank"></a>
      </div>
      <div class="team-member">
        <img src="./assets/sergey-photo.jpg" alt="" class="team-member-img">
        <h3 class="team-member-name">Сергей</h3>
        <p class="member-duty">Developer, designer</p>
        <div class="member-actions">
          <ul>
            <li>API - взаимодействие с бэкенд</li>
            <li>Игра Аудиовызов</li>
          </ul>
        </div>
        <a class="git-icon" href="https://github.com/SiarheiHa" target="_blank"></a>
      </div>
    </div>
  </section>`;
    return template;
  }
}
