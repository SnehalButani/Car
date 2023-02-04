import multer from "multer";
import fs from "fs-extra";


const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' 
    ) {
        cb(null, true);
    } else {
        cb('INVALID FILE!!!!', false);
    }
};

const storage = multer.diskStorage({
    fileFilter : fileFilter,
    destination: function (req, file, cb) {
        let path = `./uploads/img`;
        fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    }
});

const upload = multer({ storage: storage });

export default upload;