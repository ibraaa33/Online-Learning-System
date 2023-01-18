const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Name cannot be blank'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name cannot be blank'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name cannot be blank'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email cannot be blank'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password cannot be blank'],
    min: 6,
    max: 64
  },
  
  type: {
    type: [String],
    enum: ['individual', 'instructor', 'administrator', 'corporate'],
    default: 'individual',
    required: [true, 'Password cannot be blank'],
  },
  gender: {
    type: [String],
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender cannot be blank'],
  },stripe_account_id: "",
  stripe_seller: {},
  stripeSession: {},
  passwordResetCode: {
    data: String,
    default: "",
  },
},
{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
