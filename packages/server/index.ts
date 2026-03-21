import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// defining a route and a callback function
app.get('/', (req: Request, res: Response) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
