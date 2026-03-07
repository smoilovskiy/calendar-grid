import express from 'express';
import cors from 'cors';
import { holidaysRouter } from './routes/holidays.js';
import { countriesRouter } from './routes/countries.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Calendar API is running' });
});

app.use('/api/holidays', holidaysRouter);
app.use('/api/countries', countriesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
