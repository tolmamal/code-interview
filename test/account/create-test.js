const Account = require('../../models/account/Account');
const utils = require("../../utils/utils");
const {HTTP_STATUSES} = utils;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const expect = chai.expect;


chai.use(chaiHttp);

const account1 = {
    'email': 'tal@email.com',
    'name': 'Tal',
    'age': '29'
};

const account2 = {
    'email': 'noEmail',
    'name': 'noName',
    'age': '29'
};

const account3 = {
    'name': 'Tal',
    'age': '29'
};


describe('Accounts', () => {

    beforeEach((done) => {
        Account.remove({}, (err) => {
            done();
        });
    });

    describe('POST /account/create', () => {
        it('should save account into DB', async () => {
            let res = await chai.request(server).post('/api/accounts/create').send(account1);
            expect(res).to.have.status(HTTP_STATUSES.HTTP_OK);
            //in order to find account1 in DB
            let ifAccount = Account.findOne();
            expect(ifAccount).to.exist;

            //create account with email not valid
            let res2 = await chai.request(server).post('/api/accounts/create').send(account2);
            expect(res2).to.have.status(HTTP_STATUSES.HTTP_BAD_INPUT);

            //create account which already exists in DB
            let res3 = await chai.request(server).post('/api/accounts/create').send(account1);
            expect(res3).to.have.status(HTTP_STATUSES.HTTP_BAD_INPUT);

            //create account with no email
            let res4 = await chai.request(server).post('/api/accounts/create').send(account3);
            expect(res4).to.have.status(HTTP_STATUSES.HTTP_BAD_INPUT);
        })
    })


});


