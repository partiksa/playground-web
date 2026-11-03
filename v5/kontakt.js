// formulár: kontrola polí, potom pripravený e-mail na info@play-ground.sk
const form = document.getElementById('form'), err = document.getElementById('err');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = [...form.querySelectorAll('[required]')].filter((el) => !el.checkValidity());
  form.querySelectorAll('input, textarea').forEach((el) => el.removeAttribute('aria-invalid'));
  bad.forEach((el) => el.setAttribute('aria-invalid', 'true'));
  if (bad.length) {
    err.textContent = bad.some((el) => el.type === 'email' && el.value) ? 'Skontrolujte e-mail.' : 'Vyplňte meno, e-mail a správu.';
    bad[0].focus(); return;
  }
  err.textContent = '';
  const f = new FormData(form), sl = f.getAll('sluzba');
  const body = [
    sl.length ? `Záujem: ${sl.join(', ')}` : '',
    `Meno: ${f.get('meno')}`,
    f.get('prevadzka') ? `Prevádzka a mesto: ${f.get('prevadzka')}` : '',
    `E-mail: ${f.get('email')}`,
    f.get('telefon') ? `Telefón: ${f.get('telefon')}` : '',
    '', f.get('sprava'),
  ].filter((x, i) => x !== '' || i === 5).join('\n');
  const subj = `Dopyt z webu${sl.length ? ': ' + sl[0] : ''}`;
  document.getElementById('ok').hidden = false;
  location.href = `mailto:info@play-ground.sk?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
});
