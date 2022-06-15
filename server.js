//https://www.angularfix.com/2022/02/typeerror-requires-middleware-function.html
//13-error handling start 004
const express = require('express');
const cors = require('cors')
const errorHandlerMiddleware = require('./middleware/error-handler.js');
const app = express();
require('express-async-errors');
const morgan  =require('morgan')
const dotenv = require('dotenv')
dotenv.config()
//middleware

const notFoundMiddleware  = require('./middleware/not-found.js');
const connectDB = require('./db/connect.js');

//routes
const authRouter = require('./routes/authRoutes.js')
const jobRouter = require('./routes/jobsRoutes.js')
const port = process.env.PORT || 4000
app.use(cors())

if(process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}
app.use(express.json())

app.get('/', (req,res) => {
   // throw new Error('error')
    res.json({ msg: 'welcome'})
})




app.use('/api/auth', authRouter)
app.use('/api/v1/jobs', jobRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })        
        
    } catch (error) {
        console.log(error)
        
    }
}
start()

