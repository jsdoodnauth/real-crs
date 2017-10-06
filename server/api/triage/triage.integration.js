'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newTriage;

describe('Triage API:', function() {
  describe('GET /api/triages', function() {
    var triages;

    beforeEach(function(done) {
      request(app)
        .get('/api/triages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          triages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      triages.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/triages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/triages')
        .send({
          name: 'New Triage',
          info: 'This is the brand new triage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTriage = res.body;
          done();
        });
    });

    it('should respond with the newly created triage', function() {
      newTriage.name.should.equal('New Triage');
      newTriage.info.should.equal('This is the brand new triage!!!');
    });
  });

  describe('GET /api/triages/:id', function() {
    var triage;

    beforeEach(function(done) {
      request(app)
        .get(`/api/triages/${newTriage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          triage = res.body;
          done();
        });
    });

    afterEach(function() {
      triage = {};
    });

    it('should respond with the requested triage', function() {
      triage.name.should.equal('New Triage');
      triage.info.should.equal('This is the brand new triage!!!');
    });
  });

  describe('PUT /api/triages/:id', function() {
    var updatedTriage;

    beforeEach(function(done) {
      request(app)
        .put(`/api/triages/${newTriage._id}`)
        .send({
          name: 'Updated Triage',
          info: 'This is the updated triage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTriage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTriage = {};
    });

    it('should respond with the updated triage', function() {
      updatedTriage.name.should.equal('Updated Triage');
      updatedTriage.info.should.equal('This is the updated triage!!!');
    });

    it('should respond with the updated triage on a subsequent GET', function(done) {
      request(app)
        .get(`/api/triages/${newTriage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let triage = res.body;

          triage.name.should.equal('Updated Triage');
          triage.info.should.equal('This is the updated triage!!!');

          done();
        });
    });
  });

  describe('PATCH /api/triages/:id', function() {
    var patchedTriage;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/triages/${newTriage._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Triage' },
          { op: 'replace', path: '/info', value: 'This is the patched triage!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTriage = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTriage = {};
    });

    it('should respond with the patched triage', function() {
      patchedTriage.name.should.equal('Patched Triage');
      patchedTriage.info.should.equal('This is the patched triage!!!');
    });
  });

  describe('DELETE /api/triages/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/triages/${newTriage._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when triage does not exist', function(done) {
      request(app)
        .delete(`/api/triages/${newTriage._id}`)
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
