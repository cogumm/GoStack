import fs from "fs";
import path from "path";
import mime from "mime";
import aws, { S3 } from "aws-sdk";
import uploadConfig from "@config/upload";
import IStorageProvider from "../models/IStorageProvider";

export default class DiskStorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: process.env.AWS_DEFAULT_REGION,
        });
    }

    public async saveFile(file: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        const ContentType = mime.getType(originalPath);

        if (!ContentType) {
            throw new Error("File not found.");
        }

        const fileContent = await fs.promises.readFile(originalPath);

        await this.client
            .putObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
                ACL: "public-read",
                Body: fileContent,
                ContentType,
                ContentDisposition: `inline; filename=${file}`,
            })
            .promise();

        // Depois que terminar de fazer o upload do arquivo, apagar ele localmente.
        await fs.promises.unlink(originalPath);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
            })
            .promise();
    }
}
