//
// Imports
//

import fs from "node:fs";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DateTime } from "luxon";

import { configuration } from "../instances/configuration.js";
import { s3Client } from "../instances/s3-client.js";

//
// Function
//

export async function uploadArchive(archivePath : string) : Promise<void>
{
	console.log("[UploadArchive] Uploading archive...");

	const key = configuration.s3Configuration.path + "/" + DateTime.utc().toFormat("yyyy_LL_dd_HH_mm_ss") + ".tar.gz";

	const readStream = fs.createReadStream(archivePath);

	const putObjectCommand = new PutObjectCommand(
		{
			ACL: "private",
			Bucket: configuration.s3Configuration.bucket,
			ContentType: "application/gzip",
			Key: key,
			Body: readStream,
		});

	await s3Client.send(putObjectCommand);
}