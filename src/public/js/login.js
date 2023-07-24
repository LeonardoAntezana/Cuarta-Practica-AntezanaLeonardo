let form = document.querySelector('#login__form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const data = new FormData(form);
  const obj = {}
  data.forEach((value, key) => obj[key] = value);

  fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => {
    if(res.status === 200){
      window.location.replace('/products');
    }
  });

})