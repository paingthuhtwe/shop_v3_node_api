require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
app.use(express.json());
const permitRouter = require('./routes/permit');
const roleRouter = require('./routes/role');

app.use('/api/permits', permitRouter)
app.use('/api/roles', roleRouter)

app.use((error, req, res, next) => {
    res.status(error?.status ?? 500).json({ success: 0, message: error.message})
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port - ${process.env.PORT}.`)
})

