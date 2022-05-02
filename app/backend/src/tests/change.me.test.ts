import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import UsersModel from '../database/models/UsersModel';
import { userMock } from './mocks';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Seu teste', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UsersModel, "findOne")
      .resolves({
          ...userMock
        } as UsersModel);
  });

  after(()=>{
    (UsersModel.findOne as sinon.SinonStub).restore();
  })

  it('Post route for login', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login').send({ email: 'teste@tester.com', password: 'tantantan321'})

    expect(chaiHttpResponse.status).to.be.equal(200)
  });
});
