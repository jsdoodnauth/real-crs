'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './message.events';

var MessageSchema = new mongoose.Schema({
  message: String,
  contactID: String,
  contactName: String,
  followup: Number,
  agentID: String,
  agentName: String,
  isDone: Boolean,
  isNewContact: Boolean,
  userCreated: String,
  dateCreated: Date,
  userModified: String,
  dateModified: Date
});

registerEvents(MessageSchema);
export default mongoose.model('Message', MessageSchema);
