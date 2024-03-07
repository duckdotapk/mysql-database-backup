//
// Imports
//

import { z } from "zod";

//
// Type
//

export type S3Configuration = z.infer<typeof S3ConfigurationSchema>;

export const S3ConfigurationSchema = z.object(
	{
		endpoint: z.string(),
		region: z.string(),
		accessKeyId: z.string(),
		secretAccessKey: z.string(),
		bucket: z.string(),
		path: z.string(),
	});