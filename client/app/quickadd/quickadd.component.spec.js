'use strict';

describe('Component: QuickaddComponent', function() {
  // load the controller's module
  beforeEach(module('realCrsApp.quickadd'));

  var QuickaddComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    QuickaddComponent = $componentController('quickadd', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
