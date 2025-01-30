import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Admin schema
const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that email is unique in the database
    trim: true,
    lowercase: true, // Converts the email to lowercase automatically
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Regex for email validation
  },
  name: {
    type: String,
    required: true,
    trim: true, // Trims whitespace
  },
  role: {
    type: String,
    required: true,
    enum: ['Volunteer', 'President', 'HOD'], // You can extend this list with other roles as needed
    default: 'User',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
