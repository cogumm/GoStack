import path from "path";
import crypt from "crypto";
import multer from "multer";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

export default {
    directory: tmpFolder,

    storage: multer.diskStorage({
        destination: tmpFolder,
        filename(req, file, cb) {
            const fileHash = crypt.randomBytes(10).toString("hex");
            const fileName = `${fileHash}-${file.originalname}`;

            return cb(null, fileName);
        },
    }),
};
