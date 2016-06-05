'use strict';

var app = require('../..');
import request from 'supertest';

var newSta001;

describe('Sta001 API:', function() {

  describe('GET /api/sta001s', function() {
    var sta001s;

    beforeEach(function(done) {
      request(app)
        .get('/api/sta001s')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          sta001s = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(sta001s).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/sta001s', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/sta001s')
        .send({
          name: 'New Sta001',
          info: 'This is the brand new sta001!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newSta001 = res.body;
          done();
        });
    });

    it('should respond with the newly created sta001', function() {
      expect(newSta001.name).to.equal('New Sta001');
      expect(newSta001.info).to.equal('This is the brand new sta001!!!');
    });

  });

  describe('GET /api/sta001s/:id', function() {
    var sta001;

    beforeEach(function(done) {
      request(app)
        .get('/api/sta001s/' + newSta001._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          sta001 = res.body;
          done();
        });
    });

    afterEach(function() {
      sta001 = {};
    });

    it('should respond with the requested sta001', function() {
      expect(sta001.name).to.equal('New Sta001');
      expect(sta001.info).to.equal('This is the brand new sta001!!!');
    });

  });

  describe('PUT /api/sta001s/:id', function() {
    var updatedSta001;

    beforeEach(function(done) {
      request(app)
        .put('/api/sta001s/' + newSta001._id)
        .send({
          name: 'Updated Sta001',
          info: 'This is the updated sta001!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedSta001 = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSta001 = {};
    });

    it('should respond with the updated sta001', function() {
      expect(updatedSta001.name).to.equal('Updated Sta001');
      expect(updatedSta001.info).to.equal('This is the updated sta001!!!');
    });

  });

  describe('DELETE /api/sta001s/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/sta001s/' + newSta001._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when sta001 does not exist', function(done) {
      request(app)
        .delete('/api/sta001s/' + newSta001._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
