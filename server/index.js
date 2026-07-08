const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const multer     = require('multer');
const authRoutes     = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ── Auth routes ───────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Multer (store in memory) ──────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ── MongoDB Post Model ────────────────────────────────
const postSchema = new mongoose.Schema({
  type:       { type: String, enum: ['complaint', 'advice', 'help'], required: true },
  text:       { type: String, required: true },
  author:     { type: String, default: 'Anonymous' },
  roomNumber: { type: String, default: null },
  seatNumber: { type: String, default: null },
  imageData:  { type: String, default: null }, // Base64 image stored here
  status:     { type: String, enum: ['pending', 'reviewing', 'resolved'], default: 'pending' },
  createdAt:  { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// ── Routes ────────────────────────────────────────────

// GET all posts (newest first)
app.get('/api/posts', async (req, res) => {
  console.log(`📨 GET request handled by container: ${process.env.HOSTNAME}`);
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST create a new post
app.post('/api/posts', authMiddleware, upload.single('image'), async (req, res) => {
  console.log(`📨 POST request handled by container: ${process.env.HOSTNAME}`);
  try {
    const { type, text } = req.body;

    // Get user info from token automatically
    const author     = req.user.name;
    const roomNumber = req.user.roomNumber;
    const seatNumber = req.user.seatNumber;

    // Convert image to Base64 and store in MongoDB
    let imageData = null;
    if (req.file) {
      const base64   = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      imageData = `data:${mimeType};base64,${base64}`;
    }

    const post = await Post.create({
      type,
      text,
      author,
      roomNumber,
      seatNumber,
      imageData,
    });

    res.status(201).json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Admin - get all posts
app.get('/api/admin/posts', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Admin - update post status
app.patch('/api/admin/posts/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});


// ─────────────────────────────────────────────────────
// ADD THIS TO server/index.js
// Paste this BEFORE the mongoose.connect() section at the bottom
// ─────────────────────────────────────────────────────

// ── Office Complaint Model ────────────────────────────
const officeComplaintSchema = new mongoose.Schema({
  text:       { type: String, required: true },
  author:     { type: String, default: 'Anonymous' },
  roomNumber: { type: String, default: null },
  seatNumber: { type: String, default: null },
  status:     { type: String, enum: ['pending', 'reviewing', 'resolved'], default: 'pending' },
  createdAt:  { type: Date, default: Date.now },
});
const OfficeComplaint = mongoose.model('OfficeComplaint', officeComplaintSchema);

// ── Tutor Message Model ───────────────────────────────
const tutorMessageSchema = new mongoose.Schema({
  tutorName:  { type: String, required: true },
  text:       { type: String, required: true },
  author:     { type: String, default: 'Anonymous' },
  roomNumber: { type: String, default: null },
  seatNumber: { type: String, default: null },
  createdAt:  { type: Date, default: Date.now },
});
const TutorMessage = mongoose.model('TutorMessage', tutorMessageSchema);

// ── Office Complaint Routes ────────────────────────────

// POST a new office complaint (student)
app.post('/api/office-complaints', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Complaint text is required' });
    }

    const complaint = await OfficeComplaint.create({
      text,
      author:     req.user.name,
      roomNumber: req.user.roomNumber,
      seatNumber: req.user.seatNumber,
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// GET all office complaints (admin only)
app.get('/api/office-complaints', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const complaints = await OfficeComplaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// PATCH update office complaint status (admin only)
app.patch('/api/office-complaints/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const complaint = await OfficeComplaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

// ── Tutor Message Routes ───────────────────────────────

// POST a new message to a house tutor (student)
app.post('/api/tutor-messages', authMiddleware, async (req, res) => {
  try {
    const { tutorName, text } = req.body;
    if (!tutorName || !text || !text.trim()) {
      return res.status(400).json({ error: 'Tutor name and message are required' });
    }

    const message = await TutorMessage.create({
      tutorName,
      text,
      author:     req.user.name,
      roomNumber: req.user.roomNumber,
      seatNumber: req.user.seatNumber,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET all tutor messages (admin only)
app.get('/api/tutor-messages', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const messages = await TutorMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ── Connect DB & Start Server ─────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/nfchpost')
  .then(() => {
    console.log('✅ MongoDB connected to:', process.env.MONGODB_URI);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB error:', err));

  // Canteen Model
const canteenSchema = new mongoose.Schema({
  itemName:  { type: String, required: true },
  rating:    { type: String, enum: ['good', 'moderate', 'bad', 'worst'], required: true },
  comment:   { type: String, default: '' },
  author:    { type: String, default: 'Anonymous' },
  roomNumber:{ type: String, default: null },
  imageData: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Canteen = mongoose.model('Canteen', canteenSchema);

// GET canteen posts
app.get('/api/canteen', async (req, res) => {
  try {
    const posts = await Canteen.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// POST canteen feedback
app.post('/api/canteen', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { itemName, rating, comment } = req.body;
    const author     = req.user.name;
    const roomNumber = req.user.roomNumber;

    let imageData = null;
    if (req.file) {
      const base64  = req.file.buffer.toString('base64');
      const mime    = req.file.mimetype;
      imageData     = `data:${mime};base64,${base64}`;
    }

    const post = await Canteen.create({
      itemName, rating, comment,
      author, roomNumber, imageData
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create' });
  }
});