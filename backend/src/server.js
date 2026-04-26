require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const { logger } = require('./middlewares/logEvents');
const errorLogger = require('./middlewares/errorLogger');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
mongoose.connection.once('open', () => console.log('[DB] Connected to MongoDB'));

// Middlewares
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/testimonies', require('./routes/testimonyRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Error handler
app.use(errorLogger);

app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
