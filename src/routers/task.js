const express = require('express');
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post("/tasks", auth ,async (req,res)=>{

    const task = new Task({
        ...req.body,
        owner:req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e)
    }
})
//GET /task?completed=false
//GET /task?limit=10&skip=20
//GET /task?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
    const match = {}
    const sort = {}
    
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortyBy) {
        const parts = req.query.sortyBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try {
        //const tasks = await Task.findById({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks);
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.get("/tasks/:id", auth ,async (req,res)=>{
    const { id: _id } = req.params;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send(e);
    }
})

router.patch("/tasks/:id" ,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error:'Invalid Updates!'})
    }
    try
    {
        const {id:_id} = req.params;
        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        task.save();
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)  
    }
})

router.delete("/tasks/:id",async (req,res)=>{
    try {
        const { id: _id } = req.params;
        const task = await Task.findByIdAndDelete(_id);
        if(!task){
            return res.status(404).send();
        }
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e);
    }
})


module.exports = router;