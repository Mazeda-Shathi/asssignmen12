const express = require('express');
const { MongoClient } = require('mongodb')
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rap36.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("sunglass");
        const productCollection = database.collection('products')
        const allsunglassCollection = database.collection('allsunglass')
        const buyCollection = database.collection('order')
        const reviewCollection = database.collection('review')
        const usersCollection = database.collection('users')

        //get ApI for product
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const product = await cursor.toArray();
            res.json(product)
        })
        //post API for product 
        app.post('/products', async (req, res) => {
            console.log("hit post");
            const product = req.body
            const result = await productCollection.insertOne(product)
            res.json(result)
        })


        //get ApI for Moreproduct
        app.get('/moreproduct', async (req, res) => {
            const cursor = allsunglassCollection.find({});
            const moreproduct = await cursor.toArray();
            res.json(moreproduct)
        })
        //post API for Moreproduct 
        app.post('/moreproduct', async (req, res) => {
            console.log("hit post");
            const moreproduct = req.body
            const result = await allsunglassCollection.insertOne(moreproduct)
            res.json(result)
        })



        //get single product
        app.get('/products/:_id', async (req, res) => {
            const id = req.params._id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const singleProduct = await productCollection.findOne(query);
            res.json(singleProduct)
        })
        //get single moreproduct
        app.get('/moreproduct/:_id', async (req, res) => {
            const id = req.params._id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const singleMoreProduct = await allsunglassCollection.findOne(query);
            res.json(singleMoreProduct)
        })



        //post API for Order
        app.post('/order', async (req, res) => {
            console.log("hit post");
            const buyproduct = req.body
            const result = await buyCollection.insertOne(buyproduct)
            res.json(result)
        })
        //get api for order
        app.get('/order', async (req, res) => {
            const cursor = buyCollection.find({});
            const order = await cursor.toArray();
            res.json(order)
        })



        //delete ApI for MyOrder/manage order
        app.delete('/order/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) };
            const result = await buyCollection.deleteOne(query);
            res.json(result)
        })



        //delete ApI for manageProduct
        app.delete('/moreproduct/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) };
            const result = await allsunglassCollection.deleteOne(query);
            res.json(result)
        })

        //get ApI for review
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.json(review)
        })
        //post API for review
        app.post('/review', async (req, res) => {
            console.log("hit post");
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.json(result)
        })
        //post API for users
        app.post('/users', async (req, res) => {
            console.log(req.body);
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.json(result)
        })
        //check admin
        app.get('users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        //post for user
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.json(result)
        })

        //put users
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        //put roll admin
        app.put('/users/Admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })


    } finally {
        //  await client.close();
    }
}









run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost`, port)
})