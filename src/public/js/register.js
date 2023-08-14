let form = document.querySelector('#register__form');

form.addEventListener('submit', async event => {
  event.preventDefault();

  const data = new FormData(form);
  const obj = {}
  data.forEach((value, key) => obj[key] = value);

  try {
    let { status } = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json' }
    });
    if (status === 200) window.location.replace('/login')
  } catch (error) {
    console.log(error);  
  }
})