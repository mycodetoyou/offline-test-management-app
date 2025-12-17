import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/register', async (req, res) => {

  console.log("BODY : ", req.body);
  try {
    const { name, fatherName, mobile, password, center } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, mobile and Password are required"
      });
    }

    const existingStudent = await Student.findOne({ mobile });

    if (existingStudent) {
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
    console.log("Register error: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log("BODY : ", req.body);

    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and Password required"
      });
    };

    const student = await Student.findOne({ mobile });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number!"
      });
    };

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        success: true,
        message: "Invalid password"
      });
    };

    const token = jwt.sign({
      id: student._id,
      mobile: student.mobile
    },

      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successfull",
      token,
      student: {
        id: student._id,
        name: student.name,
        mobile: student.mobile,
        paymentStatus: student.paymentStatus
      }
    });

  } catch (error) {
    console.log("Login error: ", error);
    res.status(500).json({
      success: true,
      message: error.message
    });
  };
});

router.get('/me', auth, async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      })
    }

    res.json({
      success: true,
      student
    })


  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  };
});

export default router;