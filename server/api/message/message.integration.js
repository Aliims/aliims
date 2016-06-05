'use strict';

var app = require('../..');
import request from 'supertest';

var newMessage;

describe('Message API:', function() {

  describe('GET /api/messages', function() {
    var messages;

    beforeEach(function(done) {
      request(app)
        .get('/api/messages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          messages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(messages).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/messages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/messages')
        .send({
          email: 'New Message email!',
          description: 'New Message description!!',
          content: 'New Message content!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newMessage = res.body;
          done();
        });
    });

    it('should respond with the newly created message', function() {
      expect(newMessage.email).to.equal('New Message email!');
      expect(newMessage.description).to.equal('New Message description!!');
      expect(newMessage.content).to.equal('New Message content!!!');
    });

  });

  describe('GET /api/messages/:id', function() {
    var message;

    beforeEach(function(done) {
      request(app)
        .get('/api/messages/' + newMessage._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          message = res.body;
          done();
        });
    });

    afterEach(function() {
      message = {};
    });

    it('should respond with the requested message', function() {
      expect(message.email).to.equal('New Message email!');
      expect(message.description).to.equal('New Message description!!');
      expect(message.content).to.equal('New Message content!!!');
    });

  });

  describe('PUT /api/messages/:id', function() {
    var updatedMessage;

    beforeEach(function(done) {
      request(app)
        .put('/api/messages/' + newMessage._id)
        .send({
          email: 'Updated Message email!',
          description: 'Updated Message description!!',
          content: 'Updated Message content!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMessage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMessage = {};
    });

    it('should respond with the updated message', function() {
      expect(updatedMessage.email).to.equal('Updated Message email!');
      expect(updatedMessage.description).to.equal('Updated Message description!!');
      expect(updatedMessage.content).to.equal('Updated Message content!!!');
    });

  });

  describe('DELETE /api/messages/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/messages/' + newMessage._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when message does not exist', function(done) {
      request(app)
        .delete('/api/messages/' + newMessage._id)
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
