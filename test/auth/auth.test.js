import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');
let cookie;

describe('Testing Auth routes', () => {

  it('[POST] api/auth/register - Register a new user', async function () {
    const registerUserMock = {
      first_name: 'Pablo',
      last_name: 'Garcia',
      email: 'pablogarcia@gmail.com',
      age: 22,
      password: '123',
    }
    const response = await requester.post('/api/auth/register').send(registerUserMock);
    expect(response.statusCode).to.be.eql(200);
    expect(response.body.payload).to.be.eql('User registed');
  })

  it('[POST] api/auth/login - Login a user', async () => {
    const loginUserMock = {
      email: 'pablogarcia@gmail.com',
      password: '123',
    }
    const response = await requester.post('/api/auth/login').send(loginUserMock);
    cookie = response.headers['set-cookie'][0];
    expect(response.statusCode).to.be.eql(200);
    expect(response.body.payload).to.be.eql('Usuario logeado');
  })

  it('[GET] api/auth/current - Get current user', async () => {
    const response = await requester.get('/api/auth/current').set('Cookie', cookie);
    expect(response.body.payload.name).to.be.eql('Pablo Garcia');
    expect(response.body.payload.email).to.be.eql('pablogarcia@gmail.com');
  })

})