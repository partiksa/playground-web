// formulár: kontrola polí, potom pripravený e-mail na info@play-ground.sk (bez servera)
const form = document.getElementById('form'), err = document.getElementById('err'), ok = document.getElementById('ok');
const ICO = 'info@play-ground.sk';
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (form.web.value) return; // honeypot
  const bad = [...form.querySelectorAll('[required]')].filter((el) => !el.checkValidity());
  form.querySelectorAll('input, textarea').forEach((el) => el.removeAttribute('aria-invalid'));
  bad.forEach((el) => el.setAttribute('aria-invalid', 'true'));
  if (bad.length) {
    err.textContent = bad.some((el) => el.type === 'email' && el.value) ? 'Skontrolujte e-mail.' : 'Vyplňte meno, e-mail a správu.';
    bad[0].focus(); return;
  }
  err.textContent = '';
  const f = new FormData(form), sl = f.getAll('sluzba');
  const rows = [
    ['Záujem', sl.join(', ')], ['Meno', f.get('meno')], ['Prevádzka a mesto', f.get('prevadzka')], ['E-mail', f.get('email')], ['Telefón', f.get('telefon')],
    ['Plocha', f.get('plocha') && f.get('plocha') + ' m²'], ['Výška stropu', f.get('strop') && f.get('strop') + ' m'], ['Termín', f.get('kedy')],
  ].filter(([, v]) => v);
  const body = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n\n' + f.get('sprava');
  const subj = `Dopyt z webu${sl.length ? ': ' + sl[0] : ''}`;
  const href = `mailto:${ICO}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  document.getElementById('ok-mail').href = href;
  document.getElementById('ok-text').textContent = `Komu: ${ICO}\nPredmet: ${subj}\n\n${body}`;
  form.classList.add('sent'); ok.hidden = false; ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
  location.href = href;
});
document.getElementById('ok-copy').addEventListener('click', (ev) => {
  const t = document.getElementById('ok-text').textContent;
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { ev.target.textContent = 'Skopírované'; }, () => { const r = document.createRange(); r.selectNodeContents(document.getElementById('ok-text')); getSelection().removeAllRanges(); getSelection().addRange(r); ev.target.textContent = 'Text je označený, stlačte Cmd+C'; });
});
