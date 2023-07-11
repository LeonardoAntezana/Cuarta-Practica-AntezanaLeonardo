const socket = io();

let userName = document.querySelector('#userName');
let message = document.querySelector('#input__message');
let containerMessages = document.querySelector('.container__messages');

let user;
let expresion = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/

Swal.fire({
  title: 'Escriba su email',
  input: 'text',
  inputValidator: (value) => {
    if(!value.trim()) return 'campo incompleto';
    else if(!expresion.test(value)) return 'ingrese un email valido';
    user = value;
    userName.innerText = user;
  },
  showConfirmButton: false,
  allowOutsideClick: false,
})

message.addEventListener('keyup', event => {
  if (event.key === 'Enter' && message.value.trim()) {
    socket.emit('sendMessage', { user, message: message.value });
    message.value = '';
  };
})

socket.on('newMessage', data => {
  let div = document.createElement('div');
    div.innerHTML = `<div>
                      <span>${data.user}:</span>
                      <span>${data.message}</span>
                    </div>`
    containerMessages.appendChild(div);
})