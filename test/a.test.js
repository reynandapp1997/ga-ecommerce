const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.use(chaiHttp);

const expect = chai.expect;

const User = require('../models/user');

var tokenResetPassword;

describe('USER', () => {
    before(done => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe('POST', () => {
        it('ADD CUSTOMER USER', done => {
            chai.request(server)
                .post('/api/user')
                .send({
                    name: 'Reynanda Putra Pratama',
                    email: 'reynandapp1997@gmail.com',
                    password: 'gegewepe',
                    gender: 'Male',
                    role: 'Customer'
                })
                .end((err, res) => {
                    expect(res.status).eql(201);
                    done();
                });
        });
        it('ADD MERCHANT USER', done => {
            chai.request(server)
                .post('/api/user')
                .send({
                    name: 'reytama shop',
                    email: 'reynandapp1997@yahoo.com',
                    password: 'gegewepe',
                    gender: 'Female',
                    role: 'Merchant'
                })
                .end((err, res) => {
                    expect(res.status).eql(201);
                    done();
                });
        });
        it('FAILED ADD USER WITH EXIST EMAIL', done => {
            chai.request(server)
                .post('/api/user')
                .send({
                    name: 'Reynanda Putra Pratama',
                    email: 'reynandapp1997@gmail.com',
                    password: 'gegewepe',
                    gender: 'Male',
                    role: 'Customer'
                })
                .end((err, res) => {
                    expect(res.status).eql(500);
                    done();
                });
        });
        it('LOGIN CUSTOMER', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'reynandapp1997@gmail.com',
                    password: 'gegewepe'
                })
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('LOGIN MERCHANT', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'reynandapp1997@yahoo.com',
                    password: 'gegewepe'
                })
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('FAILED LOGIN WITH INVALID CREDENTIALS', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'reynandapp1997@gmail.comm',
                    password: 'gegewepe'
                })
                .end((err, res) => {
                    expect(res.status).eql(404);
                    done();
                });
        });
        it('FAILED LOGIN WITH INVALID CREDENTIALS', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'reynandapp1997@gmail.com',
                    password: 'gegewepee'
                })
                .end((err, res) => {
                    expect(res.status).eql(401);
                    done();
                });
        });
    });

    describe('GET', () => {
        it('GET ALL USER', done => {
            chai.request(server)
                .get('/api/user')
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body.length).eql(2);
                    done();
                });
        })
    });

    describe('RESET PASSWORD', () => {
        it('RESET CUSTOMER PASSWORD', done => {
            chai.request(server)
                .post('/api/user/reset-password')
                .send({
                    email: 'reynandapp1997@gmail.com'
                })
                .end((err, res) => {
                    tokenResetPassword = res.body.data.token;
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('RESET CUSTOMER INVALID', done => {
            chai.request(server)
                .post('/api/user/reset-password')
                .send({
                    email: 'reynandapp1997@reytama.com'
                })
                .end((err, res) => {
                    expect(res.status).eql(404);
                    done();
                });
        });
        it('RESET CUSTOMER PASSWORD', done => {
            chai.request(server)
                .post(`/api/user/reset/${tokenResetPassword}`)
                .send({
                    password: 'GEGEWEPE'
                })
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('LOGIN CUSTOMER', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'reynandapp1997@gmail.com',
                    password: 'GEGEWEPE'
                })
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
    });
});
