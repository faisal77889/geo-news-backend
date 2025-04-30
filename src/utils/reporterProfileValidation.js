const validator = require("validator");

const reporterProfileValidation = (reporterData) => {
  const { firstName, lastName, photoUrl, bio, location } = reporterData;

  if ("firstName" in reporterData) {
    if (!firstName || typeof firstName !== "string" || firstName.length < 3) {
      throw new Error("First name must be a string with at least 3 characters.");
    }
  }

  if ("lastName" in reporterData) {
    if (!lastName || typeof lastName !== "string" || lastName.length < 3) {
      throw new Error("Last name must be a string with at least 3 characters.");
    }
  }

  if ("photoUrl" in reporterData) {
    if (!validator.isURL(photoUrl)) {
      throw new Error("Photo URL must be a valid URL.");
    }
  }

  if ("bio" in reporterData) {
    if (typeof bio !== "string" || bio.length < 10) {
      throw new Error("Bio must be a string with at least 10 characters.");
    }
  }

  if ("location" in reporterData) {
    if (!location || !location.coordinates || !Array.isArray(location.coordinates)) {
      throw new Error("Location coordinates must be provided as an array.");
    }

    const [longitude, latitude] = location.coordinates;

    if (typeof longitude !== "number" || typeof latitude !== "number") {
      throw new Error("Longitude and latitude must be numbers.");
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error("Longitude must be between -180 and 180 degrees.");
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error("Latitude must be between -90 and 90 degrees.");
    }
  }

  // Only return validated fields
  const validated = {};
  if ("firstName" in reporterData) validated.firstName = firstName;
  if ("lastName" in reporterData) validated.lastName = lastName;
  if ("photoUrl" in reporterData) validated.photoUrl = photoUrl;
  if ("bio" in reporterData) validated.bio = bio;
  if ("location" in reporterData) validated.location = location;

  return validated;
};

module.exports = reporterProfileValidation;
