const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
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
  }
});

async function run(){
    try{
        const popularMoviesCollections = client.db('moviesHub').collection('popularMovies');
        const allMoviesCollections = client.db('moviesHub').collection('allMovies');
        const userReviewCollections = client.db('moviesHub').collection('userReviews');
        
        // all popular movies get and limit
        app.get('/movies', async(req, res) =>{
            const query = {};
            const result = (await popularMoviesCollections.find(query).toArray()).slice(0, 8);
            res.send(result);
        });

        // popular single movie
        app.get('/movie/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const result = await popularMoviesCollections.findOne(query);
          res.send(result);
        });

        // all popular movie
        app.get('/allMovies', async(req, res) =>{
            const query = {};
            const result = (await popularMoviesCollections.find(query).toArray());
            res.send(result);
        });

        // add review to database
        app.post('/userReview', async(req, res) =>{
          const review = req.body;
          const result = await userReviewCollections.insertOne(review);
          res.send(result);
        })

    }
    finally{

    }
}
run().catch((error) => console.error(error));

app.get('/', (req, res) =>{
    res.send('port is running');
})
app.listen(port, () => console.log(`port is running ${port}`));