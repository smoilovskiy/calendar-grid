import express from 'express';
import cors from 'cors';
import { holidaysRouter } from './routes/holidays.js';
import { countriesRouter } from './routes/countries.js';
import { tasksRouter } from './routes/tasks.js';
import { activityRouter } from './routes/activity.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Calendar API is running' });
});

app.use('/api/holidays', holidaysRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/activity', activityRouter);

export default app;
