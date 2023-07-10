const socket = io();

let user;
let input = document.querySelector('#input__user');
let message = document.querySelector('#input__message');
let containerMessages = document.querySelector('.container__messages');

input.addEventListener('keyup', event => {
  if (event.key === 'Enter' && input.value.trim()) {
    user = input.value;
    input.remove();
  }
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