import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');
let cookie; 
const mockProduct = {
  title: 'product mock 2',
  description: 'mock description 2',
  code: '124',
  price: 2000,
  status: true,
  stock: 100,
  category: 'mock category',
  owner: 'admin'
}

describe('Testing Product routes', async () => {

  it('[GET]: api/products - Get all products', async () => {
    const { statusCode, body } = await requester.get('/api/products');
    expect(statusCode).to.be.equal(200);
    expect(body.payload.payload).to.be.an('array');
  })

  it('[POST]: api/products - Not permit to create product', async () => {
    const { statusCode, body } = await requester.post('/api/products').send(mockProduct);
    expect(statusCode).to.be.eql(403);
    expect(body.error).to.be.eql('No tienes autenticacion activa');
  })

  it('[POST]: api/products - Add/create product', async () => {

    let adminMock = { email: 'adminCoder@coder.com', password: 'adminCod3r123' }
    
    const responseAdminLogged = await requester.post('/api/auth/login').send(adminMock);
    cookie = responseAdminLogged.headers['set-cookie'][0];

    const response = await requester.post('/api/products').send(mockProduct).set('Cookie', cookie);
    expect(response.statusCode).to.be.eql(200);
    expect(response.body.payload.title).to.be.eql(mockProduct.title);
  })

  it('[GET]: api/products/:pid - Get one product', async () => {
    const { statusCode, body } = await requester.get(`/api/products/${mockProduct._id}`);
    expect(statusCode).to.be.eql(400);
    expect(body.error).to.be.eql('Product not found');
  })

  it('[PUT]: api/products/:pid - Delete product', async () => {
    const response = await requester.delete(`/api/products/${mockProduct._id}`).set('Cookie', cookie);
    expect(response.statusCode).to.be.eql(400);
    expect(response.body.error).to.be.eql('Product not found');
  })

  it('[PUT]: api/products/:pid - Update product with incorrect id', async () => {
    const mockUpdateProduct = {
      price: 2000,
      stock: 200,
    }
    const response = await requester.put(`/api/products/${mockProduct._id}`).send(mockUpdateProduct).set('Cookie', cookie);
    expect(response.statusCode).to.be.eql(400);
  })

})