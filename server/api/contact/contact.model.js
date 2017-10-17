'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './contact.events';

var ContactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  companyName: String,
  dob: Date,
  sex: String,
  email: String,
  phone: String,
  occupation: String,
  income: String,
  leadType: String,
  leadStatus: String,
  notes: String,
  rating: Number,
  agentName: String,
  userCreated: Number,
  dateCreated: Date,
  userModified: Number,
  dateModified: Date
});

registerEvents(ContactSchema);
export default mongoose.model('Contact', ContactSchema);
