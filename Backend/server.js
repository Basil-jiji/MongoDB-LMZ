import express from 'express';
import connectDB from './config/db.js';
import placeRoutes from './routes/placeRoutes.js';
import userRoutes from './routes/userRoutes.js';

const port = 5000;

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is Running...!');
});

app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
