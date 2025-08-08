const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type:String,
    required:[true, 'Name field is required']
  },
  email: {
    type:String,
    required:[true, 'Email field is required']
  },
  password: {
    type:String,
    required:[true, 'Password fields is required'],
    minlength: [6, 'atleast 6 characters required']
  },
  role:{
    type: String, enum: ['user', 'admin'], default: 'user'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;