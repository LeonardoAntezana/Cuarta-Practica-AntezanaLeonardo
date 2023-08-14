let btnLogOut = document.querySelector('#logout');

btnLogOut.addEventListener('click', async () => {
  try {
    let { status } = await fetch('/api/auth/logout');
    if (status === 200) window.location.replace('/login')
  } catch (error) {
    console.log(error.message);
  }
})