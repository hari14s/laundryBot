import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  clothesId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cloth', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  serviceType: {
    type: String,
    enum: ['iron', 'wash', 'iron_and_wash'],
    required: true
  },
  itemPrice: { 
    type: Number, 
    required: true 
  }
});

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
  orderStatus: {
    type: String,
    enum: ['completed', 'in-progress'],
    default: 'in-progress'
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  orderItems: [orderItemSchema]
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
