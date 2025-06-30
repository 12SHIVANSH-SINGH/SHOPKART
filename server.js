import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';   // will get api status data at console only helps in debugging
import connectDb from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors';
dotenv.config();
import categoryRoutes from './routes/categoryRoutes.js';
// database connection
connectDb();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);

app.get('/',(req,res)=>{
    res.send({
        message : "Welcomen to site"
    })
});




app.listen(process.env.PORT || 8000, ()=>{
    console.log(`SERVER RUNNING on mode ${process.env.DEV_MODE} AT ${process.env.PORT || 8000}`.bgGreen.white);
})

// morgan helps in api handling...