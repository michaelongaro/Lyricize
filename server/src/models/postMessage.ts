import mongoose, { Schema, Model } from "mongoose";

const postSchema: Schema = new Schema({
  title: String,
  message: String,
  creator: String,
  tags: [String],
  selectedFile: String,
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const PostMessage = mongoose.model("PostMessage", postSchema);

const lyricsSchema = new Schema({
  value: String,
  occurances: Number,
});

const songSchema = new Schema({
  lyrics: lyricsSchema,
});

const allSongs = new Schema({
  songs: [songSchema],
});

const userSchema = new Schema({
  customID: Number,
  songList: allSongs,
});

const allUsersSchema = new Schema({
  songList: allSongs,
});

const Lyrics = mongoose.model("Lyrics", lyricsSchema);

export default PostMessage;
