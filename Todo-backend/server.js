const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/mern-app")
.then(()=>{
console.log("DB Connected!");
})
.catch((err)=>{
console.log(err);
})

const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

const todoModel = mongoose.model('todo', todoSchema);

app.post('/todos', async(req,res)=>{
const {title, description} = req.body;
try {
    const newTodo = new todoModel({title, description});
    await newTodo.save();
    res.status(201).json(newTodo);
} catch(error) {
    console.log(error);
    res.status(500).json({message : error.message});
}
})

app.get('/todos', async(req,res)=>{
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch(error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
})

app.put('/todos/:id', async (req,res)=>{
    const {title, description} = req.body;
    const id = req.params.id;

    try {
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new: true}
        )

        if(!updatedTodo){
            res.status(404).json({message : "Item not Found"});
        }
        res.json(updatedTodo);
    } catch(error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
})

app.delete('/todos/:id', async (req, res)=>{
    const id = req.params.id;
    console.log(`Deleting item with ID: ${id}`);

    try{
        const deleteTodo = await todoModel.findByIdAndDelete(id);

        if(!deleteTodo){
            res.status(404).json({message : "Item not Found"});
        } else{
            res.status(204).end();
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
})

const port = 8000;
app.listen(port, ()=>{
    console.log("Server is listening to the Port " + port);
})