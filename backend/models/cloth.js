import mongoose from "mongoose";

const clothSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    iron_price : {
        type : Number,
        required : true
    },
    wash_price: {
        type: Number,
        required: true
    },
    iron_and_wash_price: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Cloth', clothSchema);

