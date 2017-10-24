'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var contactRelationshipCtrlStub = {
  index: 'contactRelationshipCtrl.index',
  show: 'contactRelationshipCtrl.show',
  create: 'contactRelationshipCtrl.create',
  upsert: 'contactRelationshipCtrl.upsert',
  patch: 'contactRelationshipCtrl.patch',
  destroy: 'contactRelationshipCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var contactRelationshipIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './contactRelationship.controller': contactRelationshipCtrlStub
});

describe('ContactRelationship API Router:', function() {
  it('should return an express router instance', function() {
    contactRelationshipIndex.should.equal(routerStub);
  });

  describe('GET /api/contactRelationships', function() {
    it('should route to contactRelationship.controller.index', function() {
      routerStub.get
        .withArgs('/', 'contactRelationshipCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/contactRelationships/:id', function() {
    it('should route to contactRelationship.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'contactRelationshipCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/contactRelationships', function() {
    it('should route to contactRelationship.controller.create', function() {
      routerStub.post
        .withArgs('/', 'contactRelationshipCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/contactRelationships/:id', function() {
    it('should route to contactRelationship.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'contactRelationshipCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/contactRelationships/:id', function() {
    it('should route to contactRelationship.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'contactRelationshipCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/contactRelationships/:id', function() {
    it('should route to contactRelationship.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'contactRelationshipCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
