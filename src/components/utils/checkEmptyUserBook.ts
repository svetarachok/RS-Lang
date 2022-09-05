export function checkEmptyUserBook() {
  const cards = [...document.querySelectorAll<HTMLElement>('.card')];
  const audioCallBtn = document.getElementById('audiocall-btn') as HTMLElement;
  const sprintBtn = document.getElementById('sprint-btn') as HTMLElement;
  const isEmptyPage = cards.every((card) => card.style.display === 'none');
  if (isEmptyPage) {
    audioCallBtn.classList.add('btn__disabled');
    sprintBtn.classList.add('btn__disabled');
    const cardsWrapepr = document.querySelector('.cards-wrapper') as HTMLElement;
    cardsWrapepr.innerHTML = 'В вашем учебнике нет Сложных слов';
  }
}
