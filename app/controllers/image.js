const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();

// using multer to import images and save them
const multer = require('multer');
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(file)
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "public/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, Date.now() + '-' + name);
    }
});




// root to update the charity logo image and cover image
router.put("/uploadImages", multer({ storage: storage }).single("image"), async (req, res, next) => {

    const url = req.protocol + "://" + req.get("host");
    const path = url + "/images/" + req.file.filename;
    res.json({ success: true, url: path });

});








module.exports = router;








