const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

require('./models');

const connectMongoose = require('./config/mongoose');
const { connectSequelize } = require('./config/sequelize');
const { connectRedis } = require('./config/redis');

const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const uploadRouter = require('./routes/uploadRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');
const reviewRouter = require('./routes/reviewRoute');

const app = express();
dotenv.config();

app.use(cors())
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/reviews', reviewRouter);

app.get('/', (req, res) => {
  res.send('Hiii!');
});

const startServer = async () => {	
	try {
		await connectSequelize();
		await connectMongoose();
		await connectRedis();

		const port = process.env.PORT || 5002;

		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (error) {
		console.log('Error while starting the server:', error.message);
		process.exit(1);
	}
	
};
startServer();