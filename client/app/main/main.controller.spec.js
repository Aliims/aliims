'use strict';

describe('Component: mainComponent', function() {

  // load the controller's module
  beforeEach(module('aliimsApp'));
  beforeEach(module('stateMock'));
  beforeEach(module('socketMock'));

  var scope;
  var mainComponent;
  var state;
  var $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(
    _$httpBackend_,
    $http,
    $componentController,
    $rootScope,
    $state,
    socket) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/api/messages')
        .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

      scope = $rootScope.$new();
      state = $state;
      mainComponent = $componentController('main', {
        $http: $http,
        $scope: scope,
        socket: socket
      });
  }));

  it('should attach a list of messages to the controller', function() {
    mainComponent.$onInit();
    $httpBackend.flush();
    mainComponent.messages.length.should.equal(4);
  });

});
