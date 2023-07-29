const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide password');
    process.exit(1);
} 

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@premiumplus.m3e2rxl.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', true);
mongoose.connect(url);

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

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`Added ${person.name} to phonebook`)
        mongoose.connection.close();
    })
} else {
    Person.find({}).then(result => {
        console.log('Phonebook: ')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close();
    })
}


