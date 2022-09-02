export function checkPageAllDone() {
  const cards: HTMLElement[] = [...document.querySelectorAll('.card')] as HTMLElement[];
  const pageWrapper: HTMLElement = document.querySelector('.text-book-page') as HTMLElement;
  const pageNumber: HTMLInputElement = document.querySelector('.page-input') as HTMLInputElement;
  const audioCallBtn = document.querySelector('[href="/book/audiocall"]');
  const sprintBtn = document.querySelector('[href="/book/sprint"]');
  const res = cards.every((card) => {
    const hardBtn = card.querySelector('.btn-add');
    const learnBtn = card.querySelector('.btn-learn');
    return (hardBtn?.classList.contains('hard-word-btn') || learnBtn?.classList.contains('learn-word-btn'));
  });
  if (res) {
    pageWrapper.style.border = '3px solid #332a7c';
    pageNumber.style.border = '3px solid #332a7c';
    if (audioCallBtn) audioCallBtn.classList.add('btn__disabled');
    if (sprintBtn) sprintBtn.classList.add('btn__disabled');
  } else {
    pageWrapper.style.border = '3px solid #ffffff';
    if (pageNumber) {
      pageNumber.style.border = 'none';
    }
    if (audioCallBtn) audioCallBtn.classList.remove('btn__disabled');
    if (sprintBtn) sprintBtn.classList.remove('btn__disabled');
  }
}
