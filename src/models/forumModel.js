const mongoose = require("mongoose");

const ForumSchema = new mongoose.Schema({
  title: { 
    type: String, 
    unique: true, 
    required: [true, 'Um fórum precisa ter um título'] 
  },
  description: { 
    type: String,
    default: ''
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Um fórum precisa ter um criador']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  unreadCount: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para contar membros
ForumSchema.virtual('membersCount').get(function() {
  return this.members ? this.members.length : 0;
});

// Adicionar criador aos membros automaticamente
ForumSchema.pre('save', function(next) {
  if (this.isNew && this.creator && !this.members.includes(this.creator)) {
    this.members.push(this.creator);
  }
  next();
});

module.exports = mongoose.model("Forum", ForumSchema);