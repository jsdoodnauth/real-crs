'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var personCtrlStub = {
  index: 'personCtrl.index',
  show: 'personCtrl.show',
  create: 'personCtrl.create',
  upsert: 'personCtrl.upsert',
  patch: 'personCtrl.patch',
  destroy: 'personCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var personIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './person.controller': personCtrlStub
});

describe('Person API Router:', function() {
  it('should return an express router instance', function() {
    personIndex.should.equal(routerStub);
  });

  describe('GET /api/persons', function() {
    it('should route to person.controller.index', function() {
      routerStub.get
        .withArgs('/', 'personCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/persons/:id', function() {
    it('should route to person.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'personCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/persons', function() {
    it('should route to person.controller.create', function() {
      routerStub.post
        .withArgs('/', 'personCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/persons/:id', function() {
    it('should route to person.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'personCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/persons/:id', function() {
    it('should route to person.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'personCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/persons/:id', function() {
    it('should route to person.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'personCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
