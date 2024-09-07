import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import userRoutes from './backend_src/routes/user';
import batteryChargeRoutes from './backend_src/routes/batteryCharge';
import clientRoutes from './backend_src/routes/client';
import sequelize from './backend_src/models';

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() to parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/battery_charge', batteryChargeRoutes);
app.use('/api/clients', clientRoutes);

// Path to the Angular app's build output
const angularDistDir = path.join(__dirname, '../batteryUi/dist/browser');

// Serve static files from the Angular app's build output directory
app.use(express.static(angularDistDir));

// Catch-all route to serve Angular's index.html for non-API routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(angularDistDir, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing database connection...');
  await sequelize.close();
  console.log('Database connection closed.');
  process.exit(0);
});
