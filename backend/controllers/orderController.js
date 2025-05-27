import Order from '../models/order.js';
import Cloth from '../models/cloth.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No order items provided" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const { type, quantity, service } = item;

      const cloth = await Cloth.findOne({ name: type });
      if (!cloth) {
        return res.status(404).json({ error: `Cloth type '${type}' not found` });
      }

      let itemPrice;
      if (service === 'iron') itemPrice = cloth.iron_price;
      else if (service === 'wash') itemPrice = cloth.wash_price;
      else if (service === 'iron_and_wash') itemPrice = cloth.iron_and_wash_price;
      else {
        return res.status(400).json({ error: `Invalid service type '${service}'` });
      }

      const totalItemPrice = itemPrice * quantity;
      totalPrice += totalItemPrice;

      orderItems.push({
        clothesId: cloth._id,
        quantity,
        serviceType: service,
        itemPrice: totalItemPrice
      });
    }

    const newOrder = new Order({
      userId,
      orderStatus: 'in-progress',
      totalPrice,
      orderItems
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .select('createdAt orderStatus totalPrice');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, userId })
      .populate('orderItems.clothesId', 'name')
      .exec();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


