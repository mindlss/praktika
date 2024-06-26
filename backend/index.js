const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const jsonParser = bodyParser.json();

const dev = process.env.NODE_ENV === 'dev';

// load database
require('./database');

// load parser
require('./parser');

const app = express();

app.use(cors());
app.use(jsonParser);

// load api routes
const apiRoute = require('./routes/Api');

app.use('/api/', apiRoute);

// load swagger if dev
if (dev) {
    const swaggerRoute = require('./routes/Swagger');
    app.use(swaggerRoute);
}

// load static files
// app.use(express.static(path.join(__dirname + '/public')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/public/index.html'));
// });

const server = app.listen(process.env.PORT, () =>
    console.log(`Express.js server started on port ${process.env.PORT}`)
);
