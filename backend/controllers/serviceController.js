import Cloth from "../models/cloth.js";

export const getServices = async (req, res) => {
    try{
        const services = Cloth.find();
        res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};