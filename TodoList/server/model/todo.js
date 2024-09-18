const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: String,
    body: String,
    completed: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  
});

module.exports = mongoose.model('Todo', todoSchema);
