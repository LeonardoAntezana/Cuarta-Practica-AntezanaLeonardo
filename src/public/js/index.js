const socketClient = io();

const containerProducts = document.querySelector('.container__products');

socketClient.on('addProduct', data => {
  const { title, description, code, price, stock, category } = data;
  const div = document.createElement('div');
  div.className = `product ${code}`;
  div.innerHTML = `<h3>${title}</h3>
                  <p>${description}</p>
                  <p>${category}</p>
                  <p>${price}</p>
                  <p>${stock}</p>`;
  containerProducts.appendChild(div);
})

socketClient.on('deleteProduct', data => {
  const productDiv = document.querySelector(`.${data}`);
  productDiv.remove();
})