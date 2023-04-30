require('dotenv').config();

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./model/user'); 
const Contact = require('./model/contact');


mongoose.connect(process.env.MONG_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


app.use(express.json());


app.post('/api/register', async (req, res) => {

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');
  user = new User({
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10)
  });
  await user.save();

  res.send(user);
});

app.post('/api/login', async (req, res) => {
 
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  res.send(user);
});

// For Contacts 

app.get('/contacts', async (req, res) => {
    const contacts = await Contact.find();
    console.log(contacts);
    res.send(contacts);
  });
  
  app.post('/contacts', async (req, res) => {
    const contact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
      user_id: req.body.user_id
    });
    await contact.save();
    res.send(contact);
  });
  
  app.put('/contacts/:id', async (req, res) => {
    const contact = await Contact.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      phone: req.body.phone
    }, { new: true });
    res.send(contact);
  });
  
  app.delete('/contacts/:id', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  });


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
