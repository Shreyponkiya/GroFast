const adminSchema = new mongoose.Schema({
    ShopName: {
        type: String,
        required: true,
    },
    ShopAddress: {
        type: String,
        required: true,
    },
    ShopPhone: {
        type: String,
        required: true,
    },
    ShopGST: {
        type: String,
        required: true,
    },
    Highest_Reting: {
        type: Number,
        default: 0,
    },
    Profit:{
        type: Number,
        default: 0,
    },
    Total_Sold:{
        type: Number,
        default: 0,
    },
    Total_Products:{
        type: Number,
        default: 0,
    },
    Total_Orders:{
        type: Number,
        default: 0,
    },
    Total_Users:{
        type: Number,
        default: 0,
    },
    Total_Delivery:{
        type: Number,
        default: 0,
    },
    Total_Products_Ordered:{
        type: Number,
        default: 0,
    },
})

const adminModel = new mongoose.model("admin", adminSchema);

module.exports = adminModel;