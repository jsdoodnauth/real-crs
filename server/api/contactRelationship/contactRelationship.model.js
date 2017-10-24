'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './contactRelationship.events';

var ContactRelationshipSchema = new mongoose.Schema({
  primaryID: String,
  linkID: String,
  linkName: String,
  relationshipType: String,
  connection: [{ "type" : mongoose.Schema.Types.ObjectId, 'ref': 'Contact' }]
});

registerEvents(ContactRelationshipSchema);
export default mongoose.model('ContactRelationship', ContactRelationshipSchema);
