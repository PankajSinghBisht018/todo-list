const express = require('express');
const Todo = require('../model/todo');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'helloworld';


const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token found, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};



router.get('/', authMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, body, completed } = req.body;
        const newTodo = new Todo({
            title,
            body,
            completed,
            user: req.user  
        });
        await newTodo.save();
        res.json(newTodo);
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body, completed } = req.body;
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, user: req.user },
            { title, body, completed },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (error) {
        if (error instanceof mongoose.CastError && error.kind === 'ObjectId') {
            res.status(400).json({ error: 'Invalid ObjectId' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findOneAndDelete({ _id: id, user: req.user });
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        if (error instanceof mongoose.CastError && error.kind === 'ObjectId') {
            res.status(400).json({ error: 'Invalid ObjectId' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

module.exports = router;
