'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newContactRelationship;

describe('ContactRelationship API:', function() {
  describe('GET /api/contactRelationships', function() {
    var contactRelationships;

    beforeEach(function(done) {
      request(app)
        .get('/api/contactRelationships')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          contactRelationships = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      contactRelationships.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/contactRelationships', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/contactRelationships')
        .send({
          name: 'New ContactRelationship',
          info: 'This is the brand new contactRelationship!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newContactRelationship = res.body;
          done();
        });
    });

    it('should respond with the newly created contactRelationship', function() {
      newContactRelationship.name.should.equal('New ContactRelationship');
      newContactRelationship.info.should.equal('This is the brand new contactRelationship!!!');
    });
  });

  describe('GET /api/contactRelationships/:id', function() {
    var contactRelationship;

    beforeEach(function(done) {
      request(app)
        .get(`/api/contactRelationships/${newContactRelationship._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          contactRelationship = res.body;
          done();
        });
    });

    afterEach(function() {
      contactRelationship = {};
    });

    it('should respond with the requested contactRelationship', function() {
      contactRelationship.name.should.equal('New ContactRelationship');
      contactRelationship.info.should.equal('This is the brand new contactRelationship!!!');
    });
  });

  describe('PUT /api/contactRelationships/:id', function() {
    var updatedContactRelationship;

    beforeEach(function(done) {
      request(app)
        .put(`/api/contactRelationships/${newContactRelationship._id}`)
        .send({
          name: 'Updated ContactRelationship',
          info: 'This is the updated contactRelationship!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedContactRelationship = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedContactRelationship = {};
    });

    it('should respond with the updated contactRelationship', function() {
      updatedContactRelationship.name.should.equal('Updated ContactRelationship');
      updatedContactRelationship.info.should.equal('This is the updated contactRelationship!!!');
    });

    it('should respond with the updated contactRelationship on a subsequent GET', function(done) {
      request(app)
        .get(`/api/contactRelationships/${newContactRelationship._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let contactRelationship = res.body;

          contactRelationship.name.should.equal('Updated ContactRelationship');
          contactRelationship.info.should.equal('This is the updated contactRelationship!!!');

          done();
        });
    });
  });

  describe('PATCH /api/contactRelationships/:id', function() {
    var patchedContactRelationship;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/contactRelationships/${newContactRelationship._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ContactRelationship' },
          { op: 'replace', path: '/info', value: 'This is the patched contactRelationship!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedContactRelationship = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedContactRelationship = {};
    });

    it('should respond with the patched contactRelationship', function() {
      patchedContactRelationship.name.should.equal('Patched ContactRelationship');
      patchedContactRelationship.info.should.equal('This is the patched contactRelationship!!!');
    });
  });

  describe('DELETE /api/contactRelationships/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/contactRelationships/${newContactRelationship._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when contactRelationship does not exist', function(done) {
      request(app)
        .delete(`/api/contactRelationships/${newContactRelationship._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
