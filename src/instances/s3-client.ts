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
		endpoint: configuration.s3.endpoint,
		forcePathStyle: false,
		region: configuration.s3.region,
		credentials:
			{
				accessKeyId: configuration.s3.accessKeyId,
				secretAccessKey: configuration.s3.secretAccessKey,
			},
	});