const mongoose= require('mongoose');


mongoose.connect('mongodb://localhost:27017/promanage')
.then(()=>{
    console.log('Connected To MongoDB')
})
.catch((error)=>{
    console.log('Failed to connect to MongoDB:', error)
}) 