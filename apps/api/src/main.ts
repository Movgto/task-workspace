import express from 'express';
import cors from 'cors';
import authRouter from './auth/auth.routes.js';

const app = express();

app.use(cors(
    {credentials: true, origin: process.env.FRONTEND_URL}
));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => res.send("The app is running!"));

app.use('/api/auth', authRouter);

app.listen(PORT, () => console.log(`The app is running on http://localhost:${PORT}`));
