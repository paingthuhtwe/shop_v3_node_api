require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
app.use(express.json());
const fileUplaod = require('express-fileupload');
app.use(fileUplaod());
const permitRouter = require('./routes/permit');
const roleRouter = require('./routes/role');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const subCategoryRouter = require('./routes/sub_category');
const childCategoryRouter = require('./routes/child_category');
const tagRouter = require('./routes/tag');

app.use('/api/permits', permitRouter)
app.use('/api/roles', roleRouter)
app.use('/api', userRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/sub-categories', subCategoryRouter)
app.use('/api/child-categories', childCategoryRouter)
app.use('/api/tags', tagRouter)

app.use((error, req, res, next) => {
    res.status(error?.status ?? 500).json({ success: 0, message: error.message})
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port - ${process.env.PORT}.`)
})

