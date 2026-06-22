const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

const VALID_SEATS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
const ROOM_RANGES = [
  [301, 312],
  [401, 412],
  [501, 512],
  [601, 612],
  [701, 712],
  [801, 812],
  [901, 912],
  [1001, 1012],
  [1101, 1112],
  [1201, 1212],
  [1301, 1312],
  [1401, 1412],
  [1501, 1512],
  [1601, 1612]
];

function isValidRoomNumber(roomNumber) {
  const num = Number(roomNumber);
  return Number.isInteger(num) && ROOM_RANGES.some(([min, max]) => num >= min && num <= max);
}

function isValidSeatNumber(seatNumber) {
  return VALID_SEATS.includes(String(seatNumber || '').trim().toUpperCase());
}

// ── REGISTER ──────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, batch, department, roomNumber, seatNumber, password } = req.body;
    const normalizedRoom = String(roomNumber || '').trim();
    const normalizedSeat = String(seatNumber || '').trim().toUpperCase();

    if (!isValidRoomNumber(normalizedRoom)) {
      return res.status(400).json({
        error: 'Room number must be one of the allowed ranges (301-312, 401-412, 501-512, 601-612, 701-712, 801-812, 901-912, 1001-1012, 1101-1112, 1201-1212, 1301-1312, 1401-1412, 1501-1512, 1601-1612).'
      });
    }

    if (!isValidSeatNumber(normalizedSeat)) {
      return res.status(400).json({
        error: 'Seat number must be one of: A1, A2, B1, B2, C1, C2, D1, D2.'
      });
    }

    const existing = await User.findOne({ roomNumber: normalizedRoom, seatNumber: normalizedSeat });
    if (existing) {
      return res.status(400).json({ error: 'This room and seat combination is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      batch,
      department,
      roomNumber: normalizedRoom,
      seatNumber: normalizedSeat,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user._id, name: user.name, roomNumber: user.roomNumber, seatNumber: user.seatNumber },
      process.env.JWT_SECRET || 'nfch_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        batch: user.batch,
        department: user.department,
        roomNumber: user.roomNumber,
        seatNumber: user.seatNumber
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ── LOGIN ─────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { roomNumber, seatNumber, password } = req.body;
    const normalizedRoom = String(roomNumber || '').trim();
    const normalizedSeat = String(seatNumber || '').trim().toUpperCase();

    if (!isValidRoomNumber(normalizedRoom) || !isValidSeatNumber(normalizedSeat)) {
      return res.status(400).json({
        error: 'Please enter a valid room number and seat number.'
      });
    }

    const user = await User.findOne({ roomNumber: normalizedRoom, seatNumber: normalizedSeat });
    if (!user) {
      return res.status(400).json({ error: 'Room number or seat number is incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, roomNumber: user.roomNumber, seatNumber: user.seatNumber },
      process.env.JWT_SECRET || 'nfch_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        batch: user.batch,
        department: user.department,
        roomNumber: user.roomNumber,
        seatNumber: user.seatNumber
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;