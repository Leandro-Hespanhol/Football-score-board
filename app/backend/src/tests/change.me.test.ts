import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import UsersModel from '../database/models/UsersModel';
import { userMock } from './mocks';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('1- Login tests', () => {

  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UsersModel, 'findOne')
      .resolves({...userMock} as UsersModel);
  });

  after(()=>{
    (UsersModel.findOne as sinon.SinonStub).restore();
  })

  it('1- Login route, Method=Post', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login').send({ email: 'teste@tester.com', password: 'tantantan321'})

    expect(chaiHttpResponse.status).to.be.equal(200)
  });
  it('2- Check email rules', async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({ email: 'emailinvalido', password: 'tantantan321'})

    expect(chaiHttpResponse.status).to.be.equal(401)
  })
  it('3- Check password rules', async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({ email: 'teste@tester.com', password: '1234'})

    expect(chaiHttpResponse.status).to.be.equal(401)
  })
  it('4- Check email and password types', async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({ email: ['emailinvalido'], password: 1234})

    expect(chaiHttpResponse.status).to.be.equal(401)
  })
  it('5- Check email and password at body request', async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({ email: '', password: ''})

    expect(chaiHttpResponse.status).to.be.equal(400)
  })
  it('6- Check token existance', async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({ email: '', password: ''})

    expect(chaiHttpResponse.status).to.be.equal(400)
  })
});

