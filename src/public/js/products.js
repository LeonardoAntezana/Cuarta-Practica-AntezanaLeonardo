let btnLogOut = document.querySelector('#logout');
let containerIcon = document.querySelector('.container__icon');

btnLogOut.addEventListener('click', async () => {
  try {
    let { status } = await fetch('/api/auth/logout');
    if (status === 200) window.location.replace('/login')
  } catch (error) {
    console.log(error.message);
  }
})

const getCartProducts = async (cartId) => {
  let res = await fetch(`/api/carts/${cartId}`);
  if(!res.ok) return alert(res.body.error);
  let resJson = await res.json();
  let formatProducts = cardProducts(resJson.payload)

  Swal.fire({
    title: 'Carrito',
    html: resJson.payload.length === 0 ? '<p>No hay productos en el carrito</p>' : formatProducts,
    width: '70%',
  })

  resJson.payload.forEach(product => {
    let btnDelete = document.getElementById(product.product._id);
    btnDelete.addEventListener('click', async () => {
      await deleteProduct(cartId, product.product._id,);
      getCartProducts(cartId);
    })
  })
   
  }


const buyProduct = async (cartId, prodId, prodTitle) => {
  try {
    await fetch(`/api/carts/${cartId}/products/${prodId}`, {
      method: 'POST',
    })
    Swal.fire({
      title: `Producto ${prodTitle} agregado al carrito`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    })
  } catch (error) {
    console.log(error)
  }
}

const buyCart = async (cartId, userEmail) => {
  Swal.fire({
    title: '¿Deseas confirmar la compra?',
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'Aceptar',
    denyButtonText: `Cancelar`,
    preConfirm: async () => {
        let res = await fetch(`/api/carts/${cartId}/purchase`, {
          method: 'POST',
          body: JSON.stringify({ email: userEmail }),
          headers: {
            'Content-Type': 'application/json',
          }
        })
        if (!res.ok) return Swal.showValidationMessage(`Request failed: ${res.body.error}`)
        return res.json();
    }
  }).then((result) => {
    if(result.isConfirmed) {
      Swal.fire({
        title: `Compra exitosa, gracias por tu compra\nDatos enviados al correo ${userEmail}`,
        timer: 2500,
        timerProgressBar: true,
      })
    }
  })

}

// FUNCIONES AUXILIARES

const cardProducts = (products) => {
  let div = document.createElement('div');
  div.className = 'container__products';
  products.forEach(product => {
    let card = `<div class="card">
                <h5 class="card-title">Nombre: ${product.product.title}</h5>
                <p class="card-text">Precio: $${product.product.price}</p>
                <p>Cantidad: ${product.quantity}</p>
                <button id=${product.product._id} class="btn btn-primary">Eliminar</button>
                </div>`
    div.innerHTML += card;
  })
  return div;
}

const deleteProduct = async (cartId, prodId) => {
  try {
    await fetch(`/api/carts/${cartId}/products/${prodId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.log(error)
  }
}