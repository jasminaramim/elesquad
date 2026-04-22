import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ObjectId } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// Safely encode MongoDB credentials to avoid unescaped character errors
const DB_USER = "elesquad";
const DB_PASS = "Ele/Sq9?uA.d3Z#6!yR";
const DEFAULT_MONGODB_URI = `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASS)}@cluster0.ssmpl.mongodb.net/elesquad?retryWrites=true&w=majority&appName=Cluster0`;
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

const client = new MongoClient(MONGODB_URI);

async function startServer() {
  await client.connect();
  const db = client.db("elesquad");
  console.log("Connected to MongoDB");

  const app = express();
  app.use(express.json());

  // Collections
  const users = db.collection('users');
  const projects = db.collection('projects');
  const reviews = db.collection('reviews');
  const documents = db.collection('documents');
  const contact = db.collection('contact');

  // Seed Data if empty
  const adminEmail = "thenaimrana@gmail.com";
  const existingAdmin = await users.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await users.insertOne({
      email: adminEmail,
      password: "password123", // User should change this
      name: "Main Admin",
      role: "Leader",
      designation: "Head of EleSquad",
      team: "Core"
    });
    console.log("Admin seeded");
  }

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

    res.json({ success: true, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  });

  // Admin User Management
  app.get('/api/admin/users', async (req, res) => {
    const allUsers = await users.find().toArray();
    res.json(allUsers);
  });

  app.delete('/api/admin/users/:id', async (req, res) => {
    try {
      await users.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Deletion failed' });
    }
  });

  app.patch('/api/admin/users/:id/role', async (req, res) => {
    const { role } = req.body;
    try {
      await users.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { role } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.patch('/api/admin/users/:id/verify', async (req, res) => {
    const { isVerified } = req.body;
    try {
      await users.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { isVerified } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await users.findOne({ _id: new ObjectId(req.params.id) });
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: 'User not found' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    const { name, bio, image, designation, team, phone } = req.body;
    try {
      await users.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { name, bio, image, designation, team, phone } }
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
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
      const proj = await projects.findOne({ _id: new ObjectId(req.params.id) });
      res.json(proj);
    } catch (err) {
      res.status(404).json({ error: 'Project not found' });
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

  app.put('/api/projects/:id/publish', async (req, res) => {
    const { isPublished } = req.body;
    try {
      await projects.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { isPublished } }
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  });



  app.delete('/api/projects/:id', async (req, res) => {
    try {
      await projects.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ success: true });
    } catch (err) {
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
    const revs = await reviews.find().sort({ _id: -1 }).toArray();
    res.json(revs);
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

  // Contact
  app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    await contact.insertOne({ name, email, message, createdAt: new Date() });
    res.json({ success: true });
  });

  // Team
  app.get('/api/team', async (req, res) => {
    // Registered members are the team
    const teamMembers = await users.find({ role: 'Member' }).toArray();
    res.json(teamMembers);
  });

  app.get('/api/team/:id', async (req, res) => {
    try {
      const member = await users.findOne({ _id: new ObjectId(req.params.id) });
      res.json(member);
    } catch (err) {
      res.status(404).json({ error: 'Member not found' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
