let form = document.querySelector('#register__form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const data = new FormData(form);
  const obj = {}
  data.forEach((value, key) => obj[key] = value);

  fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.status === 200 && window.location.replace('/login'))

})