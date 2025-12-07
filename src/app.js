const express = require('express');
const dotenv = require('dotenv');

const connectMongoose = require('./config/mongoose');
const { connectSequelize } = require('./config/sequelize');

const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const uploadRouter = require('./routes/uploadRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');
const reviewRouter = require('./routes/reviewRoute');

const app = express();
dotenv.config();

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

		const port = process.env.PORT || 5000;

		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (error) {
		console.log('Error while starting the server:', error.message);
		process.exit(1);
	}
	
};
startServer();