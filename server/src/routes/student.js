import express from "express";
import bcrypt from "bcryptjs"
import Student from "../models/Student.js";

const router = express.Router();

router.post('/register', async (req, res) => {

  console.log("BODY : ", req.body);
  try {
    const {name, fatherName, mobile, password, center} = req.body;

    if(!name || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, mobile and Password are required"
      });
    }

    const existingStudent = await Student.findOne({mobile});

    if(existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      fatherName,
      mobile,
      password: hashedPassword,
      center
    });

    res.status(201).json({
      success: true,
      message: "Registration successfull",
      student: {
        id: student._id,
        name: student.name,
        mobile: student.mobile,
        center: student.center,
        paymentStatus: student.paymentStatus,

      }
    })
  } catch (error) {
    console.log("Register error: " , error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;