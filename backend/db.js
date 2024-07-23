const mongoose = require('mongoose')
const mongoURI = 'mongodb://0.0.0.0:27017/inotebook'


const connectToMongo = ()=>{
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI, ()=>{
        console.log("database connected")
    })
}

module.exports = connectToMongo