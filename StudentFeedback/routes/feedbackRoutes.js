import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const { studentName, courseName, message, rating } = req.body;

        if (!studentName || !courseName || !message || rating === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const feedback = await Feedback.create({
            studentName,
            courseName,
            message,
            rating
        });

        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                message: "Page and limit must be positive numbers"
            });
        }

        const skip = (page - 1) * limit;

        const feedback = await Feedback.find()
            .skip(skip)
            .limit(limit);

        const totalRecords = await Feedback.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            feedback: feedback
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!["Pending", "Reviewed"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Pending or Reviewed"
            });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            message: "Feedback status updated successfully",
            feedback
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid feedback ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
});

export default router;
