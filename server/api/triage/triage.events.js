/**
 * Triage model events
 */

'use strict';

import {EventEmitter} from 'events';
var TriageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TriageEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Triage) {
  for(var e in events) {
    let event = events[e];
    Triage.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    TriageEvents.emit(event + ':' + doc._id, doc);
    TriageEvents.emit(event, doc);
  };
}

export {registerEvents};
export default TriageEvents;
