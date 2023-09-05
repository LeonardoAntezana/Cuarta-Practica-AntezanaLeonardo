let btnLogOut = document.querySelector('#logout');

btnLogOut.addEventListener('click', async () => {
  try {
    let { status } = await fetch('/api/auth/logout');
    if (status === 200) window.location.replace('/login')
  } catch (error) {
    console.log(error.message);
  }
})

const buyProduct = async (cartId, prodId) => {
  try {
    await fetch(`/api/carts/${cartId}/products/${prodId}`, {
      method: 'POST',
    })
  } catch (error) {
    console.log(error)
  }
}

const buyCart = async (cartId, userEmail) => {
  try {
    await fetch(`/api/carts/${cartId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ email: userEmail }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.log(error)
  }
}