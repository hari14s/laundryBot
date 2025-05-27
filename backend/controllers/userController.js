import mongoose from 'mongoose'
import User from '../models/user.js'
import Order from '../models/order.js';

export const getDashboard = async (req, res) => {
    try{
        const userId  = req.user.id;
        const objectId = mongoose.Types.ObjectId(userId);

        const user = await User.findById(objectId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const orders = await Order.find({ _id: objectId });
        const totalOrders = orders.length;
        res.status(201).json({ totalOrders});

    }catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const objectId = mongoose.Types.ObjectId(userId);

        const user = await User.findById(objectId);
        const {name, email } = user;
        res.status(201).json({name: name, email: email});

    }catch (err){
        console.error("Profile Error:", err);
        res.status(500).json({ message: "Something went wrong"});
    }
}

export const updateProfile = async (req, res) => {
    const {dept, phNo } = req.body;
    const userId = req.user.id;
    const objectId = mongoose.Types.ObjectId(userId);

    const updatedUser = await User.findOneAndUpdate(
        { _id: objectId },
        { $set: { department: dept, phoneNumber: phNo } },
        { new: true }
    );

    res.status(201).json({ updatedUser });
}