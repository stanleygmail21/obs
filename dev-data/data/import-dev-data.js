//IMPORT MODULES
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/Tour');
const User = require('../../models/User');

dotenv.config({ path: './config.env' });


//LOCAL DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_LOCAL, { 
    useNewUrlParser: true,  
    useUnifiedTopology: true, 
    useFindAndModify: false} )
.then(() => {
    console.log('database successfully connected');
});

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users-simple.json`, 'utf-8'));

//IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users);
        console.log('successfully uploaded');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

//DELETE ALL DATA FROM DATABASE
const deletData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        console.log('successfully deleted!');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === '--import'){
    importData();
}
else if(process.argv[2] === '--delete'){
    deletData();
}