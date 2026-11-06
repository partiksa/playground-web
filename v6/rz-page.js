// realizácie: filter podľa typu práce (riadky sa skryjú, zvyšné sa krátko objavia)
const root = document.querySelector('[data-rz]');
const btns = [...root.querySelectorAll('.rz-f button')], items = [...root.querySelectorAll('.rz-it')], none = root.querySelector('.rz-none');

btns.forEach((b) => b.addEventListener('click', () => {
  const f = b.dataset.f;
  btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  let k = 0;
  items.forEach((it) => {
    const on = !f || it.dataset.cat.split(' ').includes(f);
    it.hidden = !on;
    it.classList.remove('fl');
    if (on) { void it.offsetWidth; it.style.setProperty('--k', k++); it.classList.add('fl'); }
  });
  none.hidden = k > 0;
}));
