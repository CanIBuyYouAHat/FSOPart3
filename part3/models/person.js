require('dotenv').config()
const mongoose = require('mongoose');

// const password = process.argv[2];
// `mongodb+srv://admin:${password}@premiumplus.m3e2rxl.mongodb.net/?retryWrites=true&w=majority`;

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.set('strictQuery', true);
mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch(err => {
    console.log('error connecting to MongoDB: ', err.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)