const mongoose = require('mongoose'),
  _userSchema = mongoose.Schema;

let userSchema = new _userSchema({
  fullName: {
    type: String,
    required: [true, "smartAss we al know u have a name.. enter it"],
  },
  email: {
    type: String,
    unique: [true, "smartAss we already have this email, use another!"],
    lowercase: true,
    trim: true,
    required: [true, "smartAss we need a email to know it's you"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} does this looks like an email to you?!'
    }

  },
  role: {
    type: String,
    enum: ["authUser", "admin"],
    required: [true, "Please specify user role"],
    default: "authUser"
  },
  password: {
    type: String,
    required: [true, 'smartAss we need a password to protect your data']
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);