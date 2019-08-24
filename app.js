const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
// const io = require('socket.io');
// const server = require('http')



require('dotenv').config();

//routers
const signupRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const followRouter = require('./routes/friends')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
require('./sockets/streams')(io)


app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.DB_URI,{useNewUrlParser:true}).then(()=>{
    console.log('DB connected successfully');      
})

app.use('/api/chatapp',signupRouter);
app.use('/api/chatapp',postRouter);
app.use('/api/chatapp',userRouter);
app.use('/api/chatapp',followRouter);
const port = process.env.PORT || 3000

server.listen(port,()=>{
    console.log(`App is up and running on port: ${port}`);
    
})

