'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './person.events';

var PersonSchema = new mongoose.Schema({
  name: String,
  companyName: String,
  dob: Date,
  sex: String,
  occupation: String,
  email: String,
  phone: String,
  income: String,
  leadType: String,
  leadStatus: String,
  notes: String, 
  rating: Number,
  userCreated: Number,
  dateCreated: Date,
  userModified: Number,
  dateModified: Date
});

registerEvents(PersonSchema);
export default mongoose.model('Person', PersonSchema);