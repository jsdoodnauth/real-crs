/**
 * ContactRelationship model events
 */

'use strict';

import {EventEmitter} from 'events';
var ContactRelationshipEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ContactRelationshipEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ContactRelationship) {
  for(var e in events) {
    let event = events[e];
    ContactRelationship.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ContactRelationshipEvents.emit(event + ':' + doc._id, doc);
    ContactRelationshipEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ContactRelationshipEvents;
