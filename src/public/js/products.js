let btnLogOut = document.querySelector('#logout');

btnLogOut.addEventListener('click', () => {
  fetch('/auth/logout').then(res => res.status === 200 && window.location.replace('/login'))
})