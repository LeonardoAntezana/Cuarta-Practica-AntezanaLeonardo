let form = document.querySelector('#login__form');

form.addEventListener('submit', async event => {
  event.preventDefault();

  const data = new FormData(form);
  const obj = {}
  data.forEach((value, key) => obj[key] = value);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json' }
    })
    if(response.status === 200) { window.location.replace('/products') }
  } catch (error) {
    console.log(error);    
  }
})