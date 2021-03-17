const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

console.log(process.env.PORT);

// CONNECT TO LOCAL DATABASE
mongoose.connect(process.env.DATABASE_LOCAL, { 
    useNewUrlParser: true,  
    useUnifiedTopology: true, 
    useFindAndModify: false})
.then(()=>{
    console.log('connection to database successful');
});


//LISTENING TO PORT
const port = process.env.PORT

app.listen(port, () => {
    console.log('listening');
})