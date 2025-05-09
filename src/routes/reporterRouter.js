const express = require("express");
const reporterRouter = express.Router();
const reporterAuth = require("../middleware/reporterAuth");
const validateNewsData = require("../utils/validateNewsData");
const News = require("../models/news");

reporterRouter.post("/news/post", reporterAuth, async (req, res) => {
    try {
        const validatedNews = validateNewsData(req.body);
        const { title, category, description, image, location } = validatedNews;
        const reporterId = req.reporter._id;
        const newsForDB = {
            title,
            category,
            description,
            image,
            reporter: reporterId,
            location
        }
        const newNews = new News(newsForDB);
        const savedNews = await newNews.save();
        res.status(201).json({
            message: "News posted successfully",
            data: savedNews
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

reporterRouter.get("/news/my-news", reporterAuth, async (req, res) => {
    try {
        const reporterId = req.reporter._id;
        const newsList = await News.find({ reporter: reporterId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "News fetched successfully.",
            data: newsList
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while fetching news.",
            error: error.message
        });
    }
});

reporterRouter.patch("/news/update/:id", reporterAuth, async (req, res) => {
    try {
        const reporterId = req.reporter._id;
        const newsData = req.body;
        const newsId = req.params.id;

        const newsInDB = await News.findById(newsId);
        if (!newsInDB) {
            return res.status(404).json({
                message: "No such news found in the Database."
            });
        }
        if (String(newsInDB.reporter) !== String(reporterId)) {
            return res.status(403).json({
                message: "You are not authorized to update this news."
            });
        }
        const validatedNewsData = validateNewsData(newsData);
        const updatedNews = await News.findByIdAndUpdate(newsId, validatedNewsData, { new: true });

        res.status(200).json({
            message: "News updated successfully.",
            news: updatedNews
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while updating the news.",
            error: error.message
        });
    }
});


reporterRouter.delete("/news/delete/:id", reporterAuth, async (req, res) => {
    try {
        const newsId = req.params.id;
        const reporterId = req.reporter._id;
        
        const newsInDB = await News.findById(newsId);

        if (!newsInDB) {
            return res.status(404).json({
                message: "News not found in the database."
            });
        }
        if (newsInDB.reporter.toString() !== reporterId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this news."
            });
        }
        await News.findByIdAndDelete(newsId);

        res.status(200).json({
            message: "News deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while deleting the news.",
            error: error.message
        });
    }
});




module.exports = reporterRouter;