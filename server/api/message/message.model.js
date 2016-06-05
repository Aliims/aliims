'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  email: String,
  description: String,
  content: String,
  active: Boolean
});

export default mongoose.model('Message', MessageSchema);
