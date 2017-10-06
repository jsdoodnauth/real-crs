'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './triage.events';

var TriageSchema = new mongoose.Schema({
  name: String,
  notes: String,
  active: Boolean,
  leadType: String,
  userCreated: Number,
  dateCreated: Date,
  userModified: Number,
  dateModified: Date
});

registerEvents(TriageSchema);
export default mongoose.model('Triage', TriageSchema);
