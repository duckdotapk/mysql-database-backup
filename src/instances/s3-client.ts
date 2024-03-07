//
// Imports
//

import { S3Client } from "@aws-sdk/client-s3";

import { configuration } from "./configuration.js";

//
// S3 Instance
//

export const s3Client = new S3Client(
	{
		endpoint: configuration.s3Configuration.endpoint,
		forcePathStyle: false,
		region: configuration.s3Configuration.region,
		credentials:
			{
				accessKeyId: configuration.s3Configuration.accessKeyId,
				secretAccessKey: configuration.s3Configuration.secretAccessKey,
			},
	});