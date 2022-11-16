import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  spotifyUsername: {
    type: String,
    required: true,
  },
  shortUUID: {
    type: String,
    required: true,
  },

  // This should be its own schema with properties of name: String,
  // occurances: number. You will have to refactor all current code after
  // doing this.
  sortedLyrics: [
    {
      type: Array,
    },
  ],
});

const allUsersSchema = new mongoose.Schema(
  {
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
