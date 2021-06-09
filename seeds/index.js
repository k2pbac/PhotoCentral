const mongoose = require("mongoose");
const Photo = require("../models/photos")
const seeds = require("./seeds");

mongoose.connect('mongodb://localhost:27017/PhotoPortfolio', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// name: String,
// location: String,
// description: String,
// image: String,
// dateCaptured: Date


const seedDB = async () => {
    await Photo.deleteMany({});

    for (const el of seeds) {
        const photo = new Photo(
            {
                name: el.name,
                location: el.location,
                description: el.description,
                dateCaptured: el.dateCaptured,
                userID: "60bd6d55b22fe61930844be9",
                images: [
                    {
                        url: 'https://res.cloudinary.com/dzerhy9du/image/upload/v1623165854/PhotoCentral/lah2rvqro8pujiucysmu.jpg',
                        filename: 'PhotoCentral/lah2rvqro8pujiucysmu'
                    },
                    {
                        url: 'https://res.cloudinary.com/dzerhy9du/image/upload/v1623165855/PhotoCentral/mtelffvgmlgrwta6a47y.jpg',
                        filename: 'PhotoCentral/mtelffvgmlgrwta6a47y'
                    }
                ]
            });
        await photo.save();
    };


};

seedDB();