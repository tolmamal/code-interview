const Notification = require('../../models/notification/Notification');
const utils = require("../../utils/utils");
const {HTTP_STATUSES} = utils;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

const notification1 = {
    'accountId': '1234',
    'name': 'Tal',
    'color': 'black'

};

const notification2 = {
    'name': 'Tal',
    'color': 'black'

};

const notification3 = {
    'accountId': '1279',
    'name': 'test',
    'color': 'color'
};

const notification4 = {
    'accountId': '7777',
    'name': 'testName',
    'color': 'green'

};


describe('Notifications', () => {

    beforeEach((done) => {
        Notification.remove({}, (err) => {
            done();
        });
    });

    describe('POST /notifications/notification', () => {
        it('should save notification into DB', async () => {
            let res = await chai.request(server).post('/api/notifications/notifications').send(notification1);
            expect(res).to.have.status(HTTP_STATUSES.HTTP_OK);
            //check if notification exists
            let ifNotification = Notification.findOne();
            expect(ifNotification).to.exist;

            //create account with no accountId
            let res2 = await chai.request(server).post('/api/notifications/notifications').send(notification2);
            expect(res2).to.have.status(HTTP_STATUSES.HTTP_SERVER_ERROR); // need to change the status for this case

            //create notification which already exists in DB
            let res3 = await chai.request(server).post('/api/notifications/notifications').send(notification1);
            expect(res3).to.have.status(HTTP_STATUSES.HTTP_BAD_INPUT);
        });
    });

    describe('GET /notifications/notification', () => {
        it('should get notification from DB', async () => {
            //insert notification into DB
            let res4 = await chai.request(server).post('/api/notifications/notifications').send(notification3);
            expect(res4).to.have.status(HTTP_STATUSES.HTTP_OK);

            //getting notification from DB
            let res5 = await chai.request(server).get('/api/notifications/notifications?accountId=1279');
            expect(res5).to.have.status(HTTP_STATUSES.HTTP_OK);

            //getting invalid notification
            let res6 = await chai.request(server).get('/api/notifications/notifications?accountId=33');
            expect(res6).to.have.status(HTTP_STATUSES.HTTP_NOT_FOUND);

            //getting notification with no accountId
            let res7 = await chai.request(server).get('/api/notifications/notifications?accountId=');
            expect(res7).to.have.status(HTTP_STATUSES.HTTP_BAD_INPUT);
        });
    });

    describe('DELETE /notifications/notification', () => {
        it('should delete notification from DB', async () => {
            //insert new notification into DB
            let res8 = await chai.request(server).post('/api/notifications/notifications').send(notification4);
            expect(res8).to.have.status(HTTP_STATUSES.HTTP_OK);

            //try to delete notification with accountId but wrong color
            let res9 = await chai.request(server).delete('/api/notifications/notifications?accountId=7777&color=yellow');
            expect(res9).to.have.status(HTTP_STATUSES.HTTP_NOT_FOUND);

            // try to delete notification with no accountId
            let res10 = await chai.request(server).delete('/api/notifications/notifications?color=yellow');
            expect(res10).to.have.status(HTTP_STATUSES.HTTP_BAD_INPUT);

            //delete notification with accountId & color
            let res11 = await chai.request(server).delete('/api/notifications/notifications?accountId=7777&color=green');
            expect(res11).to.have.status(HTTP_STATUSES.HTTP_OK);

        });

    });


});