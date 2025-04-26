const validator = require("validator");

const validateNewsData = (newsInfo) => {
    const { title, category, description, image, location } = newsInfo;
    const toIterateObj = {
        title: false,
        category: false,
        description: false,
        image: false,
        location: false,
    }
    Object.keys(newsInfo).forEach((key) => {
        if (toIterateObj.hasOwnProperty(key)) {
            toIterateObj[key] = true;
        }
    });
    if (toIterateObj.title) {
        if (!title) {
            throw new Error("Title of the news is not given");
        }
    }

    const allowedCategories = ["Politics", "Sports", "Technology", "Health", "Entertainment"];
    if (toIterateObj.category) {
        if (!category || (!allowedCategories.includes(category))) {
            throw new Error("No category of news is mentioned in the news or wrong category is selected");
        }
    }
    if(toIterateObj.description){
    if (!description || !Array.isArray(description)) {
        throw new Error("Description must be an array of paragraphs.");
    }

    const isValidDescription = description.some(para => typeof para === "string" && para.length > 50);
    if (!isValidDescription) {
        throw new Error("At least one paragraph should be longer than 50 characters.");
    }
}
    if(toIterateObj.image){
    if (!image || !Array.isArray(image)) {
        throw new Error("Image must be an array of URLs.");
    }

    const isValidImage = image.some(photo => typeof photo === "string" && validator.isURL(photo));
    if (!isValidImage) {
        throw new Error("At least one valid image URL must be provided.");
    }
}
    if(toIterateObj.location){
    if (!location || !location.coordinates || !Array.isArray(location.coordinates)) {
        throw new Error("Location coordinates must be provided as an array.");
    }

    const [longitude, latitude] = location.coordinates;

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
        throw new Error("Location coordinates must be numbers.");
    }

    if (longitude < -180 || longitude > 180) {
        throw new Error("Longitude must be between -180 and 180 degrees.");
    }

    if (latitude < -90 || latitude > 90) {
        throw new Error("Latitude must be between -90 and 90 degrees.");
    }
}

    return {
        title,
        category,
        description,
        image,
        location
    };
};

module.exports = validateNewsData;
