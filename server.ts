import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Server } from 'socket.io';
import http from 'http';

// Dynamic Vite import will be handled in the dev block

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }
});

const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Safely encode MongoDB credentials
const DB_USER = "elesquad";
const DB_PASS = "Ele/Sq9?uA.d3Z#6!yR";
const DEFAULT_MONGODB_URI = `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASS)}@cluster0.ssmpl.mongodb.net/elesquad?retryWrites=true&w=majority&appName=Cluster0`;
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

const client = new MongoClient(MONGODB_URI);

let db: any = null;
let users: any, projects: any, reviews: any, documents: any, messages: any, contact: any;

async function connectToDatabase() {
  if (db) return;
  
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    db = client.db("elesquad");
    
    users = db.collection('users');
    projects = db.collection('projects');
    reviews = db.collection('reviews');
    documents = db.collection('documents');
    messages = db.collection('messages');
    contact = db.collection('contact');
    
    console.log("Connected to MongoDB successfully");
    
    // Seed Admin if missing
    const adminEmail = "thenaimrana@gmail.com";
    const existingAdmin = await users.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await users.insertOne({
        email: adminEmail,
        password: "password123",
        name: "Main Admin",
        role: "Leader",
        designation: "Head of EleSquad",
        team: "Core"
      });
      console.log("Admin seeded");
    }
  } catch (err: any) {
    console.error("CRITICAL DATABASE CONNECTION ERROR:", err.message);
    throw err;
  }
}

// Database Connection Middleware
app.use(async (req, res, next) => {
  if (req.url.startsWith('/api')) {
    try {
      await connectToDatabase();
      next();
    } catch (err: any) {
      res.status(500).json({ 
        error: "Database connection failed", 
        details: err.message,
        hint: "Ensure MONGODB_URI is correctly set in your environment variables." 
      });
    }
  } else {
    next();
  }
});

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    // Restricted registration: only allow if an admin is making the request or disable it
    // For now, let's keep it but ideally this should be used by the Admin Dashboard
    const { email, password, name, memberId, designation, team, phone, role } = req.body;

    try {
      const existingUser = await users.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already exists' });
      
      const result = await users.insertOne({
        email, password, name, memberId, designation, team, phone, role: role || 'Member', bio: '', image: ''
      });
      res.json({ success: true, id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Sorry, you are not a member of EleSquad' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.json({ success: true, user: { id: user._id, email: user.email, name: user.name, role: user.role, image: user.image } });
  });

  // File Upload
  app.post('/api/upload', (req, res) => {
    console.log('Upload request received');
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('Multer Error:', err);
        return res.status(500).json({ error: 'Upload process failed', details: err.message });
      }
      if (!req.file) {
        console.warn('Upload failed: No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      console.log('Upload successful:', imageUrl);
      res.json({ imageUrl });
    });
  });

  // Messaging API
  app.get('/api/messages/:room', async (req, res) => {
    try {
      const { room } = req.params;
      console.log(`[GET] Fetching messages for room: ${room}`);
      if (!messages) throw new Error('Messages collection not initialized');
      const history = await messages.find({ room }).sort({ timestamp: 1 }).toArray();
      console.log(`Found ${history.length} messages for room ${room}`);
      res.json(history || []);
    } catch (err: any) {
      console.error('Messages Fetch Error:', err.message);
      res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
    }
  });

  app.post('/api/messages', async (req, res) => {
    try {
      const msg = { ...req.body, timestamp: new Date() };
      await messages.insertOne(msg);
      io.to(msg.room).emit('new_message', msg);
      res.json({ success: true });
    } catch (err: any) {
      console.error('Messages Post Error:', err);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Socket.io Events
  io.on('connection', (socket) => {
    console.log('New socket client connected');
    socket.on('join_room', (room) => {
      console.log(`Socket joining room: ${room}`);
      socket.join(room);
    });

    socket.on('send_message', async (data) => {
      try {
        const msg = { ...data, timestamp: new Date() };
        await messages.insertOne(msg);
        io.to(data.room).emit('new_message', msg);
      } catch (err) {
        console.error('Socket message error:', err);
      }
    });
  });

  // Admin User Management
  app.get('/api/admin/users', async (req, res) => {
    const allUsers = await users.find().toArray();
    res.json(allUsers);
  });

  app.put('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Updating user: ${id}`);
    const { _id, password, ...updateData } = req.body;
    
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid User ID' });
    
    try {
      if (password && password.trim() !== '') {
        (updateData as any).password = password;
      }
      // Ensure no immutable fields are present
      delete (updateData as any)._id;
      
      console.log('Admin Updating User:', id, 'with data:', JSON.stringify(updateData));
      const updateResult = await users.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      console.log('Update result:', updateResult);
      
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found in database' });
      }
      res.json({ success: true, modifiedCount: updateResult.modifiedCount });
    } catch (err: any) {
      console.error('Admin User Update Error:', err);
      res.status(500).json({ 
        error: 'Update failed', 
        details: err.message,
        stack: err.stack 
      });
    }
  });

  app.delete('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
      await users.deleteOne({ _id: new ObjectId(id) });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Deletion failed' });
    }
  });

  app.patch('/api/admin/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    console.log(`Changing role for ${id} to ${role}`);
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });
    try {
      await users.updateOne({ _id: new ObjectId(id) }, { $set: { role } });
      res.json({ success: true });
    } catch (err) {
      console.error('Role Update Error:', err);
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.patch('/api/admin/users/:id/verify', async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;
    console.log(`Changing verification for ${id} to ${isVerified}`);
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });
    try {
      await users.updateOne({ _id: new ObjectId(id) }, { $set: { isVerified } });
      res.json({ success: true });
    } catch (err) {
      console.error('Verify Update Error:', err);
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
      const user = await users.findOne({ _id: new ObjectId(id) });
      res.json(user);
    } catch (err) {
      console.error('Fetch User Error:', err);
      res.status(404).json({ error: 'User not found' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { _id, ...updateData } = req.body;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
      console.log('User Updating Profile:', id, 'with:', JSON.stringify(updateData));
      const result = await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      console.log('Update result:', result);
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (err: any) {
      console.error('Update User Error:', err);
      res.status(500).json({ 
        error: 'Update failed', 
        details: err.message 
      });
    }
  });

  // Projects CRUD
  app.get('/api/projects', async (req, res) => {
    const { userId } = req.query;
    const filter = userId ? { userId: userId.toString() } : {};
    const projs = await projects.find(filter).toArray();
    res.json(projs);
  });

  app.get('/api/projects/published', async (req, res) => {
    const projs = await projects.find({ isPublished: true }).toArray();
    res.json(projs);
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
      const proj = await projects.findOne({ _id: new ObjectId(id) });
      res.json(proj);
    } catch (err) {
      res.status(500).json({ error: 'Project fetch failed' });
    }
  });

  app.post('/api/projects', async (req, res) => {
    const { 
      title, description, image, techStack, liveLink, githubLink, userId,
      orderId, clientName, profileName, sheetLink, value, totalValue, projectType,
      developerName 
    } = req.body;
    try {
      const result = await projects.insertOne({
        title, description, image, techStack, liveLink, githubLink, userId,
        orderId, clientName, profileName, sheetLink, value, totalValue, projectType,
        developerName: developerName || 'Team Member',
        isPublished: false,
        createdAt: new Date()
      });
      res.json({ id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: 'Creation failed' });
    }
  });

  app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { _id, ...updateData } = req.body;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
      await projects.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      res.json({ success: true });
    } catch (err) {
      console.error('Project Update Error:', err);
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.put('/api/projects/:id/publish', async (req, res) => {
    const { id } = req.params;
    const { isPublished } = req.body;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
      await projects.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isPublished } }
      );
      res.json({ success: true });
    } catch (err) {
      console.error('Publish Error:', err);
      res.status(500).json({ error: 'Update failed' });
    }
  });


  app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    const { _id, ...updateData } = req.body;
    try {
      await projects.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      res.json({ success: true });
    } catch (err) {
      console.error('Project Update Error:', err);
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
      await projects.deleteOne({ _id: new ObjectId(id) });
      res.json({ success: true });
    } catch (err) {
      console.error('Project Delete Error:', err);
      res.status(500).json({ error: 'Deletion failed' });
    }
  });

  // Documents
  app.get('/api/documents', async (req, res) => {
    const { userId } = req.query;
    const filter = userId ? { userId: userId.toString() } : {};
    const docs = await documents.find(filter).sort({ updatedAt: -1 }).toArray();
    res.json(docs);
  });

  app.get('/api/documents/:id', async (req, res) => {
    try {
      const doc = await documents.findOne({ _id: new ObjectId(req.params.id) });
      res.json(doc);
    } catch (err) {
      res.status(404).json({ error: 'Document not found' });
    }
  });

  app.post('/api/documents', async (req, res) => {
    const { userId, title, content } = req.body;
    const result = await documents.insertOne({ userId, title, content, updatedAt: new Date() });
    res.json({ id: result.insertedId });
  });

  app.put('/api/documents/:id', async (req, res) => {
    const { title, content } = req.body;
    await documents.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, content, updatedAt: new Date() } }
    );
    res.json({ success: true });
  });

  app.delete('/api/documents/:id', async (req, res) => {
    await documents.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  });

  // Reviews
  app.get('/api/reviews', async (req, res) => {
    const allReviews = await reviews.find().toArray();
    res.json(allReviews);
  });

  app.put('/api/reviews/:id', async (req, res) => {
    const { id } = req.params;
    const { _id, ...updateData } = req.body;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
      await reviews.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      res.json({ success: true });
    } catch (err) {
      console.error('Review Update Error:', err);
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    const { title, clientName, orderId, feedback, rating, userId, developerName } = req.body;
    const result = await reviews.insertOne({ 
      title,
      clientName,
      orderId,
      feedback, 
      rating, 
      userId,
      developerName: developerName || 'Team Member',
      createdAt: new Date()
    });
    res.json({ id: result.insertedId });
  });

  app.delete('/api/reviews/:id', async (req, res) => {
    await reviews.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  });

  // Team
  app.get('/api/team', async (req, res) => {
    // Return all users for chat (Admin + Members)
    const allSquad = await users.find().toArray();
    res.json(allSquad);
  });

  app.get('/api/team/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
      const member = await users.findOne({ _id: new ObjectId(id) });
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV, timestamp: new Date() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('SERVER ERROR:', err);
    res.status(err.status || 500).json({ 
      error: err.message || 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }

export default app;
