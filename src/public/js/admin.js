let btnLogOut = document.querySelector('#logout');

btnLogOut.addEventListener('click', async () => {
  try {
    let { status } = await fetch('/api/auth/logout');
    if (status === 200) window.location.replace('/login')
  } catch (error) {
    console.log(error.message);
  }
})

const changeUserRole = async (uid) => {
  try {
    let res = await fetch(`/api/user/premium/${uid}`, { method: 'PUT'}).then(res => res.json())
    if(!res.ok) alert(res.error)
  } catch (error) {
    alert(error);
  }
}

const deleteUser = async (uid) => {
  let res = await fetch(`/api/user/${uid}`, { method: 'DELETE'})
  if(!res.ok) alert(res.body.error);
  else{
    let userCard = document.getElementById(uid);
    userCard.remove();
  }
}