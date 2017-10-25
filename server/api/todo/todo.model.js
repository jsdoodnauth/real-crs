'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './todo.events';

var TodoSchema = new mongoose.Schema({
  title: String,
  message: String,
  contactID: String,
  contactName: String,
  communicationType: String,
  dueDate: Date,
  userID: String,
  userName: String,
  isDone: Boolean,
  userCreated: String,
  dateCreated: Date,
  userModified: String,
  dateModified: Date
});

registerEvents(TodoSchema);
export default mongoose.model('Todo', TodoSchema);
