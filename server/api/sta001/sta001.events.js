/**
 * Sta001 model events
 */

'use strict';

import {EventEmitter} from 'events';
import Sta001 from './sta001.model';
var Sta001Events = new EventEmitter();

// Set max event listeners (0 == unlimited)
Sta001Events.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Sta001.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    Sta001Events.emit(event + ':' + doc._id, doc);
    Sta001Events.emit(event, doc);
  }
}

export default Sta001Events;
