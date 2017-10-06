'use strict';

describe('Component: TriageComponent', function() {
  // load the controller's module
  beforeEach(module('realCrsApp.triage'));

  var TriageComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TriageComponent = $componentController('triage', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
