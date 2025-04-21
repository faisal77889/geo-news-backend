const mongoose = require("mongoose");
const connectDB = async () =>{
    try {
        await mongoose.connect("mongodb+srv://faisalhassan77889:Fai123sal%40@geo-news-cluster.7rdewem.mongodb.net/geo-news?retryWrites=true&w=majority&appName=geo-news-cluster/geo-news");
        
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDB;
