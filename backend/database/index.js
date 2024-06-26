const mongoose = require('mongoose');

//Initiate Mongoose Connection
mongoose
    .connect(process.env.MongoURL)
    .then(() => console.log('Mongoose connected to DB'))
    .catch((err) => console.log(err));
