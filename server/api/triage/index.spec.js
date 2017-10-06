'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var triageCtrlStub = {
  index: 'triageCtrl.index',
  show: 'triageCtrl.show',
  create: 'triageCtrl.create',
  upsert: 'triageCtrl.upsert',
  patch: 'triageCtrl.patch',
  destroy: 'triageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var triageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './triage.controller': triageCtrlStub
});

describe('Triage API Router:', function() {
  it('should return an express router instance', function() {
    triageIndex.should.equal(routerStub);
  });

  describe('GET /api/triages', function() {
    it('should route to triage.controller.index', function() {
      routerStub.get
        .withArgs('/', 'triageCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/triages/:id', function() {
    it('should route to triage.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'triageCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/triages', function() {
    it('should route to triage.controller.create', function() {
      routerStub.post
        .withArgs('/', 'triageCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/triages/:id', function() {
    it('should route to triage.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'triageCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/triages/:id', function() {
    it('should route to triage.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'triageCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/triages/:id', function() {
    it('should route to triage.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'triageCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
