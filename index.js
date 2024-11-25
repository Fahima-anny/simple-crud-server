const express = require('express');
const cors = require('cors');
const app = express() ;
const port = process.env.PORT || 5000 ;

// middleware 
app.use(cors()) ;
app.use(express.json()) ;
require('dotenv').config()



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohdc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` ;

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
    const simpleUsers = client.db("simpleUsers").collection("users");


    // get all users 
    app.get("/users", async(req, res) => {
        const cursor = simpleUsers.find() ;
        const result =await cursor.toArray() ;
        res.send(result) ;
    })


    // get one user 
    app.get("/users/:id", async (req, res) => {
        const id = req.params.id ;
        const query = {_id : new ObjectId(id)} ;
        const result = await simpleUsers.findOne(query)
        res.send(result)
    })

    
    // update an user 
    app.put("/users/:id", async(req, res) => {
        const id = req.params.id ;
        const updatedUser = req.body ;
        const filter = {_id : new ObjectId(id)} ;
        const option = { upsert: true} ;
        const updatedDoc = {
        $set : {
          name: updatedUser.name ,
          email: updatedUser.email 
        }
    }
    const result = await simpleUsers.updateOne(filter, updatedDoc, option)
    res.send(result) ;
    })


    // delete an user 
    app.delete("/users/:id", async(req,res) => {
        const id = req.params.id ;
        console.log(id)
        const query = {_id : new ObjectId(id)}
        const result = await simpleUsers.deleteOne(query)
        res.send(result)
    })


    // add a new user 
app.post('/users',async (req, res) => {
    const data = req.body ;
    console.log(data)
    const result = await simpleUsers.insertOne(data)
    res.send(result)
})


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
    res.send("simple crud server running bro") ;
})

app.listen(port, () => {
    console.log(`Simple crud running on port : ${port}`) ;
})