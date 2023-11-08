const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hybglgu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const jobCollection = client.db('jobDB').collection('jobs');
        const bidCollection = client.db('jobDB').collection('bids');


        //service related API
        app.get('/jobs', async (req, res) => {
            const cursor = jobCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.findOne(query);
            res.send(result);
        })


        app.patch('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedJobs = req.body;
            console.log(updatedJobs);
            const updateDoc = {
                $set: {
                    status: updatedJobs.status
                },
            };
            const result = await jobCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.post('/addJobs', async (req, res) => {
            const addJob = req.body;
            console.log(addJob);
            const result = await jobCollection.insertOne(addJob);
            res.send(result);
        });

        app.patch('/bids/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedBids = req.body;
            console.log(updatedBids);
            const updateDoc = {
                $set: {
                    status: updatedBids.status
                },
            };
            const result = await bidCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/postedJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/bids', async (req, res) => {
            const cursor = bidCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/bids', async (req, res) => {
            const addBids = req.body;
            console.log(addBids);
            const result = await bidCollection.insertOne(addBids);
            res.send(result);
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('job finder is running');
})

app.listen(port, () => {
    console.log(`Job finder server is running ${port}`);
})