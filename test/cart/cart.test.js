import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

const mockCart = {
  _id: '',
  products: [],
}

let cookie;
let cookieUser;

describe('Testing Cart routes', () => {

  it('[GET]: api/carts - Get all carts', async () => {
    const { status, body } = await requester.get('/api/carts');
    expect(status).to.be.equal(200);
    expect(body.payload).to.be.an('array');
  })

  it('[POST]: api/carts - Create a cart', async () => {
    const { status, body } = await requester.post('/api/carts');
    expect(status).to.be.equal(200);
    expect(body.payload).to.have.property('products');
    mockCart._id = body.payload._id;
  })

  it('[GET]: api/carts/:cid - Get one cart', async () => {
    const { status, body } = await requester.get(`/api/carts/${mockCart._id}`);
    expect(status).to.be.equal(200);
    expect(body.payload).to.be.an('array');
  })

  it('[POST]: api/carts/:cid/purchase - Buy a cart', async () => {
    const userEmailMock = 'lucyperez@gmail.com'
    const { status, body } = await requester.post(`/api/carts/${mockCart._id}/purchase`).send({ email: userEmailMock });
    expect(status).to.be.equal(400);
    expect(body.error).to.be.eql('Cart is empty');
  })

  it('[DELETE]: api/carts/:cid - Delete products from a cart', async () => {

    const adminCredentials = { email: 'adminCoder@coder.com', password: 'adminCod3r123' }
    const responseAdminLogged = await requester.post('/api/auth/login').send(adminCredentials);
    cookie = responseAdminLogged.headers['set-cookie'][0];

    const { status, body } = await requester.delete(`/api/carts/${mockCart._id}`).set('Cookie', cookie);
    expect(status).to.be.equal(403);
    expect(body.error).to.be.eql('No tienes permisos para realizar esta accion');

  })

  it('[PUT]: api/carts/:cid - Update products from a cart', async () => {
    const productsMock = [{
      title: 'product in array to update',
      description: 'mock description',
      code: '123',
      price: 5,
      status: true,
      stock: 10,
      category: 'mock category',
      owner: 'admin'
    }]

    const { status, body } = await requester.put(`/api/carts/${mockCart._id}`).send(productsMock);
    expect(status).to.be.equal(403);
    expect(body.error).to.be.eql('No tienes autenticacion activa');
  })

  it('[POST]: api/carts/:cid/products/:pid - Add product to cart', async () => {
    const mockProductId = '6525bff8a1ba1379a855d335';
    const userMock = { email: 'lucyperez@gmail.com', password: '12345678'};
    const response = await requester.post('/api/auth/login').send(userMock);
    cookieUser = response.headers['set-cookie'][0];
    const { statusCode } = await requester.post(`/api/carts/${mockCart._id}/products/${mockProductId}`).set('Cookie', cookieUser);
    expect(statusCode).to.be.equal(200);
  })

  it('[PUT]: api/carts/:cid/products/:pid - Update quantity of a product in cart', async () => {
    const mockProductId = '6525bff8a1ba1379a855d335';
    let quantityMock = { quantity: 5 };
    const { statusCode, body } = await requester.put(`/api/carts/${mockCart._id}/products/${mockProductId}`).send(quantityMock).set('Cookie', cookieUser);
    expect(statusCode).to.be.equal(200);
    expect(body.payload).to.be.eql('Se ha modificado el producto exitosamente');
  })

  it('[DELETE]: api/carts/:cid/products/:pid - Delete product from cart', async () => {
    const mockProductId = '6525bff8a1ba1379a855d335';
    const { statusCode, body } = await requester.delete(`/api/carts/${mockCart._id}/products/${mockProductId}`).set('Cookie', cookieUser);
    expect(statusCode).to.be.equal(200);
    expect(body.payload).to.be.eql('Producto eliminado del carrito');
  })

})