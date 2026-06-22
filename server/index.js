const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
// Auth routes
app.use('/api/auth', authRoutes);

// ── Cloudinary config ─────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer (store in memory, then send to Cloudinary) ─
const upload = multer({ storage: multer.memoryStorage() });

// ── MongoDB Post Model ────────────────────────────────
const postSchema = new mongoose.Schema({
  type:       { type: String, enum: ['complaint', 'advice', 'help'], required: true },
  text:       { type: String, required: true },
  author:     { type: String, default: 'Anonymous' },
  roomNumber: { type: String, default: null },
  seatNumber: { type: String, default: null },
  imageUrl:   { type: String, default: null },
  createdAt:  { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// ── Helper: upload buffer to Cloudinary ──────────────
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'nfch-hall' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

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
  try {
    const { type, text } = req.body;

    // Get user info from token automatically
    const author     = req.user.name;
    const roomNumber = req.user.roomNumber;
    const seatNumber = req.user.seatNumber;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const post = await Post.create({
      type,
      text,
      author,
      roomNumber,
      seatNumber,
      imageUrl
    });

    res.status(201).json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
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