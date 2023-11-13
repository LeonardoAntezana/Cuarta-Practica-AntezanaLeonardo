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
    }).then(res => res.json())
    if(response.payload === 'Admin logeado') window.location.replace('/admin')
    if(response.payload === 'Usuario logeado') window.location.replace('/products')
    else alert(response.error)
  } catch (error) {
    console.log(error)    
  }
})