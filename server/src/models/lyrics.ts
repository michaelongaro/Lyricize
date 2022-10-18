import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  spotifyUsername: String,
  sortedLyrics: [
    {
      type: Array,
    },
  ],
});

const allUsersSchema = new mongoose.Schema({
  usersArr: [userSchema],
});

export const UserLyrics = mongoose.model("users", userSchema);
export const GlobalLyrics = mongoose.model("global", allUsersSchema);
