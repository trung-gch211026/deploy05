const mongoose = require('mongoose')

var StudentSchema = mongoose.Schema({
    name: String,
    dob: Date,
    gender: String,
    department: String,
    class: String,
    image: String,
    gpa: Number,
    studentYear : Number
})

const StudentModel = mongoose.model("hocsinh", StudentSchema, "student")

module.exports = StudentModel