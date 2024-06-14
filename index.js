const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000;

app.use(cors());
app.use(express.json());


const uri = 'mongodb+srv://newdata:hAC0Qp8JViZ7dFyn@cluster0.pg0uckr.mongodb.net/?retryWrites=true&w=majority';
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
      await client.connect();
      const coursesCollection = client.db('crashcoursesDB').collection('courses');
      const membersCollection = client.db('crashcoursesDB').collection('members');
      
      
    //   console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //COURSE MANAGEMENT
    app.get('/courses', async(req,res)=>{
      const query = {};
      const cursor = coursesCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);

    });
  app.post('/courses',async (req, res)=>{
      const course = req.body;
      const result = await coursesCollection.insertOne(course);
      res.send(result);
  });
  app.get('/courses/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id:new ObjectId(id)};
    const result = await coursesCollection.findOne(query);
    res.send(result);
  });
  app.delete('/courses/:id', async(req, res) =>{
    const id = (req.params.id);
    const query = {_id:new ObjectId(id)};
    const result = await coursesCollection.deleteOne(query);
    res.send(result);
  });
  app.put('/courses/:id', async(req, res) =>{
    const id = req.params.id;
    const updateItem = req.body;
    const query = {_id:new ObjectId(id)};
    const options= { upsert: true};
    const updatedDoc ={
      $set: {
        title: updateItem.title,
        instructor: updateItem.instructor,
        price: updateItem.price,
        seat: updateItem.seat,
      }
    };
    // console.log(updatedDoc);
    const result = await coursesCollection.updateOne(query, updatedDoc, options); 
    res.send(result);  
  })





      //USER MANAGEMENT
      app.post('/user', async(req,res)=>{
        const user = req.body;
        const isUserExists = await membersCollection.findOne({email: user?.email});
        if(isUserExists?._id){
          return res.send({
            "status": "Login Success"
          })
        }
        const result = await membersCollection.insertOne(user);
        res.send(result);
      });

      app.get('/user', async(req,res)=>{
        const query = {};
        const cursor = membersCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
  
      });

     
   
    
  
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
  // run().catch(console.dir);
  



app.get('/', (req,res)=>{
    res.send("Server running");
});

app.listen(port, ()=>{
console.log(`sever is running on ${port}`)
});

