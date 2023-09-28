let form = document.querySelector('#putemail__form');
let containerForm = document.querySelector('.container__form');

form.addEventListener('submit', async event => {
  event.preventDefault();

  const data = new FormData(form);
  const obj = {}
  data.forEach((value, key) => obj[key] = value);

  try {
   let response = await fetch('/api/user/sendemail', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: { 'Content-Type': 'application/json' }
   })
   if(response.status === 200){
    containerForm.innerHTML = '<p><strong>Email enviado</strong></p>';
   }
  }catch (error) {
    console.log(error);    
  }
})