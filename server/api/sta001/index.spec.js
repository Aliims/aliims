'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var sta001CtrlStub = {
  index: 'sta001Ctrl.index',
  show: 'sta001Ctrl.show',
  create: 'sta001Ctrl.create',
  update: 'sta001Ctrl.update',
  destroy: 'sta001Ctrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var sta001Index = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './sta001.controller': sta001CtrlStub
});

describe('Sta001 API Router:', function() {

  it('should return an express router instance', function() {
    expect(sta001Index).to.equal(routerStub);
  });

  describe('GET /api/sta001s', function() {

    it('should route to sta001.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'sta001Ctrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/sta001s/:id', function() {

    it('should route to sta001.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'sta001Ctrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/sta001s', function() {

    it('should route to sta001.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'sta001Ctrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/sta001s/:id', function() {

    it('should route to sta001.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'sta001Ctrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/sta001s/:id', function() {

    it('should route to sta001.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'sta001Ctrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/sta001s/:id', function() {

    it('should route to sta001.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'sta001Ctrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
