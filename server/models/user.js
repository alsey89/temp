const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
  },
  password: String,
  facebookId: String,
  facebookToken: String,
  googleID: String,
  googleToken: String,
  lineID: String,
  lineToken: String,
  uuid: {
    type: String,
  },
  dateRegistered: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,

  gamesPlayed: {
    type: Number,
    default: 0,
  },
  gameHistory: Array,
  titlesEarned: {
    count: {
      type: Number,
      default: 0,
    },
    titles: {
      type: Array,
      default: [],
    },
  },
  bestPlays: {
    count: {
      type: Number,
      default: 0,
    },
    plays: {
      type: Array,
      default: [],
    },
  },
  purchasedItems: Array,
  banned: Boolean,
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  itemsEquipped: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
