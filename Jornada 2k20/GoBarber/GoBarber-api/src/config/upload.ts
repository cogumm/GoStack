import path from "path";
import crypt from "crypto";
import multer, { StorageEngine } from "multer";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

interface IUploadConfig {
    driver: "s3" | "disk";
    tmpFolder: string;
    uploadsFolder: string;
    multer: {
        storage: StorageEngine;
    };
    config: {
        disk: {};
        aws: {
            bucket: string;
        };
    };
}

export default {
    driver: process.env.STORAGE_DRIVER,

    tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, "uploads"),

    multer: {
        storage: multer.diskStorage({
            destination: tmpFolder,
            filename(req, file, cb) {
                const fileHash = crypt.randomBytes(10).toString("hex");
                const fileName = `${fileHash}-${file.originalname}`;

                return cb(null, fileName);
            },
        }),
    },

    config: {
        disk: {},
        aws: {
            bucket: "gobarber-app-cgm",
        },
    },
} as IUploadConfig;
