const express = require("express");
const News = require("../models/news");
const reporterAuth = require("../middleware/reporterAuth");
const userRouter = express.Router();

userRouter.get("/news/all",reporterAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = (limit < 50) ? limit : 50;
        const skip = (page - 1) * limit;

        const news = await News.find({})
            .populate("reporter", "firstName lastName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Fetched news successfully.",
            data: news
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong with /news/all route.",
            error: error.message,
        });
    }
});



userRouter.get("/news/:id", async (req, res) => {
    try {
        const newsId = req.params.id;
        const news = await News.findById(newsId)
            .populate("reporter", "firstName lastName");

        if (!news) {
            throw new Error("There is no news with such id");
        }

        res.status(200).json({
            message: "News fetched successfully.",
            data: news
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong with /news/:id route.",
            error: error.message,
        });
    }
});


userRouter.get("/news/category/:type", async (req, res) => {
    try {
        const category = req.params.type;
        const allowedCategories = ["Politics", "Sports", "Technology", "Health", "Entertainment"];

        if (!allowedCategories.includes(category)) {
            throw new Error("News can't be found for invalid category.");
        }

        const news = await News.find({ category: category })
            .populate("reporter", "firstName lastName")
            .sort({ createdAt: -1 });

        if (news.length === 0) {
            return res.status(200).json({
                message: `There are no news available for ${category} category at the moment.`,
                data: []
            });
        }

        res.status(200).json({
            message: `News for ${category} category fetched successfully.`,
            data: news
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong with /news/category/:type route.",
            error: error.message,
        });
    }
});




module.exports = userRouter;
