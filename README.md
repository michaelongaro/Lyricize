# Lyricize

live site: [Lyricize](https://lyricize-app.herokuapp.com/).

<!-- screenshot of homepage here -->
<p align="center">
  <img width="460" height="300" src="https://user-images.githubusercontent.com/35980684/198435746-84be6112-908b-4b38-b58c-06a9e9e0ecc8.gif">
</p>

## Description

This is a MERN app that parses, sorts, and visualizes the top lyrics of your Spotify account's liked songs. I used the [Spotify API](https://developer.spotify.com/documentation/web-api/) along with
[spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node) to access all necessary user authentication/data and used [genius-lyrics](https://www.npmjs.com/package/genius-lyrics) to fetch the lyrics.
All information is stored on an instance of [MongoDB Atlas](https://www.mongodb.com/atlas/database). Finally, the responsive bubble visualizations come from [@weknow/react-bubble-chart-d3](https://www.npmjs.com/package/@weknow/react-bubble-chart-d3).


## Available Scripts!

In the project directory, you can run:

### `npm run dev`

To start the NodeJS backend in development mode.\

and then in another terminal `cd .\client\`

To switch to the client directory, followed by another `npm run dev` which starts the React frontend in development mode

Open [http://localhost:5000](http://localhost:5000) to view the app in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
