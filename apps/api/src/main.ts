import express from 'express';
import cors from 'cors';
import authRouter from './auth/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => res.send("The app is running!"));

app.use('/api/auth', authRouter);

app.listen(PORT, () => console.log(`The app is running on http://localhost:${PORT}`));
