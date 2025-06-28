import mongoose from 'mongoose';
import colors from 'colors'
const connectDb = async () =>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URL);
        console.log("CONNECTED TO MONGODB ",con.connection.host.bgMagenta);

    } catch(error){
        console.log(`ERROR WHILE CONNECTING MONGODB ${error}`.bgRed.white);
    }
}

export default connectDb