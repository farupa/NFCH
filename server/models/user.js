const mongoose = require('mongoose');

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

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  batch: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: isValidRoomNumber,
      message: 'Room number must be in one of the allowed ranges.'
    }
  },
  seatNumber: {
    type: String,
    required: true,
    trim: true,
    enum: {
      values: VALID_SEATS,
      message: 'Seat number must be one of A1, A2, B1, B2, C1, C2, D1, D2.'
    }
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ roomNumber: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);