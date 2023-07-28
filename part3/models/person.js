const mongoose = require('mongoose');

// const password = process.argv[2];
`mongodb+srv://admin:${password}@premiumplus.m3e2rxl.mongodb.net/?retryWrites=true&w=majority`;

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

const personSchema = mongoose.Schema({
   name: String,
   number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)