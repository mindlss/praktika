const mongoose = require('mongoose');

mongoose
    .connect(process.env.MongoURL)
    .then(() => console.log('Mongoose connected to DB'))
    .catch((err) => console.log(err));
