import { PORT } from '@/constants';
import dotenv from 'dotenv';
import express from 'express';
import router from './routes';
dotenv.config();

const app = express();

// Middleware function to auto parse requests to JSON
app.use(express.json());
app.use(router);

// Server starter
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
