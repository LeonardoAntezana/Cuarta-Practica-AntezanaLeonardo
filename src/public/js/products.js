let btnLogOut = document.querySelector('#logout');

btnLogOut.addEventListener('click', () => {
  fetch('/api/auth/logout').then(res => res.status === 200 && window.location.replace('/login'))
})