import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@db:5432/receipt_db',
});

app.get('/', (req: Request, res: Response) => {
  res.send('Receipt Scanner API is running');
});

// Get all receipts
app.get('/api/receipts', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM receipts ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a receipt
app.post('/api/receipts', async (req: Request, res: Response) => {
  const { storeName, totalAmount, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO receipts (store_name, total_amount, date) VALUES ($1, $2, $3) RETURNING *',
      [storeName, totalAmount, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
