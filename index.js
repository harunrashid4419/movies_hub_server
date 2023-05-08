const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.uqseuad.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const popularMoviesCollections = client
      .db("moviesHub")
      .collection("popularMovies");
    const userReviewCollections = client
      .db("moviesHub")
      .collection("userReviews");
    const requestedMoviesCollections = client
      .db("moviesHub")
      .collection("requestMovie");
    const usersCollections = client.db("moviesHub").collection("users");
    const topRatedMoviesCollections = client
      .db("moviesHub")
      .collection("topRated");

    // top rated movies
    app.get('/topRated', async(req, res) =>{
      const movie = {};
      const result = await topRatedMoviesCollections.find(movie).toArray();
      res.send(result);
    });

    // single top rated movie
    app.get("/topRated/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await topRatedMoviesCollections.findOne(query);
      res.send(result);
    });


    // popular all movies
    app.get("/movies", async (req, res) => {
      const movie = {};
      const result = (
        await popularMoviesCollections.find(movie).toArray()
      ).slice(0, 8);
      res.send(result);
    });

    // popular single movie
    app.get("/movie/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await popularMoviesCollections.findOne(query);
      res.send(result);
    });

    // all popular movie
    app.get("/allMovies", async (req, res) => {
      const query = {};
      const result = await popularMoviesCollections.find(query).toArray();
      res.send(result);
    });

    // add review to database
    app.post("/userReview", async (req, res) => {
      const review = req.body;
      const result = await userReviewCollections.insertOne(review);
      res.send(result);
    });

    // get user review
    app.get("/reviews/:id", async (req, res) => {
      const reviewId = req.params.id;
      const id = { id: reviewId };
      const result = await userReviewCollections.find(id).toArray();
      res.send(result);
    });

    // my requested movies query by email
    app.get("/myRequest", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await requestedMoviesCollections.find(query).toArray();
      res.send(result);
    });

    // add requested movies to database
    app.post("/requestMovie", async (req, res) => {
      const request = req.body;
      const result = await requestedMoviesCollections.insertOne(request);
      res.send(result);
    });

    // user add to database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
      res.send(result);
    });

    // get all user
    app.get("/allUser", async (req, res) => {
      const query = {};
      const result = await usersCollections.find(query).toArray();
      res.send(result);
    });

    // user requested movies get
    app.get("/movieRequested", async (req, res) => {
      const movies = {};
      const result = await requestedMoviesCollections.find(movies).toArray();
      res.send(result);
    });

    // admin hook
    app.get("/user/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollections.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("port is running");
});
app.listen(port, () => console.log(`port is running ${port}`));
