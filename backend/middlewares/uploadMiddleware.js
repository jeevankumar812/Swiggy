import multer from "multer";
import path from "path";
import fs from "fs";

// Create folders automatically
const folders = [
  "uploads",
  "uploads/restaurants",
  "uploads/menu",
];

folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    // Menu Images
    if (
      req.originalUrl.includes("/menu")
    ) {
      cb(null, "uploads/menu");
    }

    // Restaurant Images
    else if (
      req.originalUrl.includes("/restaurants")
    ) {
      cb(null, "uploads/restaurants");
    }

    // Default
    else {
      cb(null, "uploads");
    }
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {

  const allowedTypes =
    /jpg|jpeg|png|webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(
    file.mimetype
  );

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;