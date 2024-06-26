const mongoose = require('mongoose');

// example schema for mongoose
const ExampleSchema = new mongoose.Schema(
    {
        uuid: {
            type: mongoose.SchemaTypes.String,
            required: true,
            unique: true,
        },
        createdAt: {
            type: mongoose.SchemaTypes.Date,
            required: true,
            default: new Date(),
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('example', ExampleSchema);
