const mongoose = require("mongoose");

if (mongoose.models.Message) {
  delete mongoose.models.Message;
}
const MessageSchema = new mongoose.Schema({
  forumId: { type: mongoose.Schema.Types.ObjectId, ref: "Forum", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  text: { type: String, required: false },

  private: { type: Boolean, default: false },
  
  image: {
    data: { type: Buffer },
    contentType: { type: String },
    originalName: { type: String },
    size: { type: Number }
  },
  
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'text_and_image'], 
    default: 'text' 
  }
}, { timestamps: true });

// Validação
MessageSchema.pre('save', function(next) {
  if (!this.text && !this.image.data) {
    return next(new Error('Mensagem deve conter texto ou imagem'));
  }
  
  if (this.text && this.image.data) this.messageType = 'text_and_image';
  else if (this.image.data) this.messageType = 'image';
  else this.messageType = 'text';

  next();
});

// Populate automático
MessageSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function() {
  this.populate('sender', 'username email avatar');
  this.populate('to', 'username email avatar');
});

MessageSchema.pre('findById', function() {
  this.populate('sender', 'username email avatar');
  this.populate('to', 'username email avatar');
});

module.exports = mongoose.model("Message", MessageSchema);
