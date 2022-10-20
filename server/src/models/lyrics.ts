import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  spotifyUsername: String,
  sortedLyrics: [
    {
      type: Array,
    },
  ],
});

const allUsersSchema = new mongoose.Schema(
  {
    // usersArr: [userSchema],
    sortedLyrics: [
      {
        type: Array,
      },
    ],
  },
  { collection: "global" }
);

export const UserLyrics = mongoose.model("users", userSchema);
export const GlobalLyrics = mongoose.model("global", allUsersSchema);
