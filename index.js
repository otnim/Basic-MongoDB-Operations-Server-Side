const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//user: otnim36
//pass: PhKiWro98PZXB6Mv

const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://otnim36:PhKiWro98PZXB6Mv@cluster0.hqd49tj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const usersCollection = client.db('CRUD-Test').collection('users');

    /*static insertion
    console.log("Connected to database");
    const user = { name: 'Promy', id: 6898 };
    const result = await usersCollection.insertOne(user);
    */

    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //return single data
    app.get('/update-user/:id', async(req, res) => {
      const {id} = req.params;
      console.log(id);
      const query = {_id: ObjectId(id)};
      const result = await usersCollection.findOne(query);
      res.send(result);
    })

    //update is done below
    app.put('/update-user/:id', async(req, res) => {
      const {id} = req.params;
      const user = req.body;
      const filter = {_id: ObjectId(id)}; //or query
      const option = {upsert: true};
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const result = await usersCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.send(result);
    })

    app.delete('/users/:id', async (req, res) => {
      const {id} = req.params;
      //console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      
      //res.send(result);
    })

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();
