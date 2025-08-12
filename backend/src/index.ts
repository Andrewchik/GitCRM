// backend/src/index.ts
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';    
import 'dotenv/config'; 
import projectsRoutes from './routes/projects';
import auth from './middleware/auth'; 

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes); 
app.use('/projects', auth, projectsRoutes);

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gitcrm')
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = Number(process.env.PORT || 4000);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
