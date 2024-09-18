const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./conn/conn');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
