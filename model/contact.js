const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    user_id: { type: String, required: true },
  });
  
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;