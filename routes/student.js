var express = require("express");
const StudentModel = require("../models/StudentModel");
const multer = require("multer");
var router = express.Router();

router.get("/", async (req, res) => {
  var students = await StudentModel.find();
  res.render("student/studentList", { students: students });
});

router.get("/delete/:id", async (req, res) => {
  var id = req.params.id;
  await StudentModel.findByIdAndDelete(id)
    .then(() => console.log("Delete successfully"))
    .catch((error) => console.log("Delete failed"));
  res.redirect("/student");
});

router.get("/deleteall", async (req, res) => {
  await StudentModel.deleteMany()
    .then(() => console.log("Delete successfully"))
    .catch((error) => console.log("Delete failed"));
  res.redirect("/student");
});

router.get("/add", (req, res) => {
  res.render("student/studentAdd");
});

var storage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "./public/images");
  },
  filename: (req, file, res) => {
    res(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

router.post("/add", upload.single("image"), async (req, res) => {
  var student = req.body;
  student.image = req.file.filename; 

  await StudentModel.create(student);
  res.redirect("/student");
});


router.get("/edit/:id", async (req, res) => {
  var id = req.params.id;
  var student = await StudentModel.findById(id);
  var formattedStudent = {
    ...student.toObject(),
    formattedDob: student.dob ? student.dob.toISOString().substring(0, 10) : "",
    selectedMale: student.gender === "Male" ? "checked" : "",
    selectedFemale: student.gender === "Female" ? "checked" : "",
    selectedIT: student.department === "IT" ? "selected" : "",
    selectedBusiness: student.department === "Business" ? "selected" : "",
    selectedGraphicDesign:
      student.department === "Graphic Design" ? "selected" : "",
  };
  res.render("student/studentEdit", { student: formattedStudent });
});

router.post("/edit/:id", upload.single("image"), async (req, res) => {
  var id = req.params.id;
  var updatedStudent = req.body;

  if (req.file) {
      updatedStudent.image = req.file.filename; 
  }

  var originalStudent = await StudentModel.findById(id);

  Object.keys(updatedStudent).forEach((key) => {
      if (updatedStudent[key] !== "" && updatedStudent[key] !== undefined) {
          originalStudent[key] = updatedStudent[key];
      }
  });

  await originalStudent.save();
  res.redirect("/student");
});


module.exports = router;
