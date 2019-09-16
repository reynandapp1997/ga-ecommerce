const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.use(chaiHttp);

const expect = chai.expect;

const Product = require('../models/product');

var merchantToken;
var customerToken;
var productId;

describe('LOGIN', () => {
    it('LOGIN MERCHANT', done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                email: 'reynandapp1997@yahoo.com',
                password: 'gegewepe'
            })
            .end((err, res) => {
                expect(res.status).eql(200);
                merchantToken = res.header.authorization;
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
                customerToken = res.header.authorization;
                done();
            });
    });
});

describe('MERCHANT ADD, UPDATE, DELETE PRODUCT', () => {
    before(done => {
        Product.deleteMany({}, err => {
            done();
        });
    });

    it('ANONYMOUS CANNOT ADD PRODUCT', done => {
        chai.request(server)
            .post('/api/product')
            .send({
                name: 'Samsung A50',
                description: 'A new line Samsung A Series 4/64',
                price: 3500000,
                qtyStock: 10
            })
            .end((err, res) => {
                expect(res.status).eql(401);
                done();
            });
    });

    it('CUSTOMER CANNOT ADD PRODUCT', done => {
        chai.request(server)
            .post('/api/product')
            .send({
                name: 'Samsung A50',
                description: 'A new line Samsung A Series 4/64',
                price: 3500000,
                qtyStock: 10
            })
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(401);
                done();
            });
    });

    it('MERCHAT ADD PRODUCT', done => {
        chai.request(server)
            .post('/api/product')
            .send({
                name: 'Samsung A50',
                description: 'A new line Samsung A Series 4/64',
                price: 3500000,
                qtyStock: 10
            })
            .set('Authorization', merchantToken)
            .end((err, res) => {
                expect(res.status).eql(201);
                done();
            });
    });

    it('GET ALL PRODUCT', done => {
        chai.request(server)
            .get('/api/product')
            .end((err, res) => {
                expect(res.status).eql(200);
                expect(res.body.length).eql(1);
                productId = res.body.data[0]._id;
                done();
            });
    });

    it('GET PRODUCT DETAIL', done => {
        chai.request(server)
            .get(`/api/product/${productId}`)
            .end((err, res) => {
                expect(res.status).eql(200);
                expect(res.body.data.metrics.seen).eql(0);
                done();
            });
    });

    it('GET PRODUCT DETAIL SEEN 1', done => {
        chai.request(server)
            .get(`/api/product/${productId}`)
            .end((err, res) => {
                expect(res.status).eql(200);
                expect(res.body.data.metrics.seen).eql(1);
                done();
            });
    });

    it('ANONYMOUS CANNOT UPDATE PRODUCT', done => {
        chai.request(server)
            .put(`/api/product/${productId}`)
            .send({
                name: 'New Samsung Galaxy A50'
            })
            .end((err, res) => {
                expect(res.status).eql(401);
                done();
            });
    });

    it('CUSTOMER CANNOT UPDATE PRODUCT', done => {
        chai.request(server)
            .put(`/api/product/${productId}`)
            .send({
                name: 'New Samsung Galaxy A50'
            })
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(401);
                done();
            });
    });

    it('MERCHANT UPDATE PRODUCT', done => {
        chai.request(server)
            .put(`/api/product/${productId}`)
            .send({
                name: 'New Samsung Galaxy A50'
            })
            .set('Authorization', merchantToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                done();
            });
    });

    it('GET PRODUCT DETAIL SEEN 2 AND UPDATED NAME', done => {
        chai.request(server)
            .get(`/api/product/${productId}`)
            .end((err, res) => {
                expect(res.status).eql(200);
                expect(res.body.data.metrics.seen).eql(2);
                expect(res.body.data.name).eql('New Samsung Galaxy A50');
                done();
            });
    });

    it('ANONYMOUS CANNOT delete PRODUCT', done => {
        chai.request(server)
            .delete(`/api/product/${productId}`)
            .end((err, res) => {
                expect(res.status).eql(401);
                done();
            });
    });

    it('CUSTOMER CANNOT delete PRODUCT', done => {
        chai.request(server)
            .delete(`/api/product/${productId}`)
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(401);
                done();
            });
    });

    it('MERCHANT delete PRODUCT', done => {
        chai.request(server)
            .delete(`/api/product/${productId}`)
            .set('Authorization', merchantToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                done();
            });
    });
});


