'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './contactRelationship.events';

var ContactRelationshipSchema = new mongoose.Schema({
  connection: [{ "type" : mongoose.Schema.Types.ObjectId, 'ref': 'Contact' }],
  relationshipType: String
});

registerEvents(ContactRelationshipSchema);
export default mongoose.model('ContactRelationship', ContactRelationshipSchema);
