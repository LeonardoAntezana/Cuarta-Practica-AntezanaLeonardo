const changeUserRole = async (uid) => {
  let res = await fetch(`/api/user/premium/${uid}`, { method: 'PUT'})
  if(!res.ok) alert(res.body.error);
}

const deleteUser = async (uid) => {
  let res = await fetch(`/api/user/${uid}`, { method: 'DELETE'})
  if(!res.ok) alert(res.body.error);
  else{
    let userCard = document.getElementById(uid);
    userCard.remove();
  }
}