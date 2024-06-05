//
// Imports
//

import fs from "node:fs";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DateTime } from "luxon";

import { configuration } from "../instances/configuration.js";

//
// Function
//

export async function uploadArchive(archivePath : string) : Promise<void>
{
	for (const s3Configuration of configuration.s3Configurations)
	{
		console.log("[UploadArchive] Uploading archive to S3 bucket:", s3Configuration.endpoint, s3Configuration.bucket);

		const s3Client = new S3Client(
			{
				endpoint: s3Configuration.endpoint,
				forcePathStyle: false,
				region: s3Configuration.region,
				credentials:
					{
						accessKeyId: s3Configuration.accessKeyId,
						secretAccessKey: s3Configuration.secretAccessKey,
					},
			});

		const key = s3Configuration.path + "/" + DateTime.utc().toFormat("yyyy_LL_dd_HH_mm_ss") + ".tar.gz";

		const readStream = fs.createReadStream(archivePath);

		const putObjectCommand = new PutObjectCommand(
			{
				ACL: "private",
				Bucket: s3Configuration.bucket,
				ContentType: "application/gzip",
				Key: key,
				Body: readStream,
			});

		await s3Client.send(putObjectCommand);
	}

}