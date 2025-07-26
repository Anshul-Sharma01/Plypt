
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("public/temp");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
    storage,
    limits : { fileSize : 50 * 1024 * 1024 }
})
