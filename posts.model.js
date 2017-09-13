const mongoose = require('mongoose')
const { Schema } = mongoose
const  { ObjectId } = Schema.types

const postSchema = new Schema({
    title: {type: String},
    body: {type: String },
    image: {type: String},
    user_id: {ref: 'User', type: ObjectId, required: true },
})

module.exports = mongoose.model('User', userSchema)