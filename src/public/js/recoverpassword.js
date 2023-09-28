let form = document.querySelector('#recover__form');

form.addEventListener('submit', async event => {
  event.preventDefault();

  const data = new FormData(form);
  const obj = {}
  data.forEach((value, key) => obj[key] = value);

  try {
    const response = await fetch('/api/user/recoverpassword', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json' }
    })
    if(response.status === 200){
      window.location.replace('/login')
    }
    
  } catch (error) {
    console.log(error);    
  }
})