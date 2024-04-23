const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  subject: String,
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
