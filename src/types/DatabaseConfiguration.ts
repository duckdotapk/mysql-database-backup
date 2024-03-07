//
// Imports
//

import { z } from "zod";

//
// Type
//

export type DatabaseConfiguration = z.infer<typeof DatabaseConfigurationSchema>;

export const DatabaseConfigurationSchema = z.object(
	{
		host: z.string(),
		port: z.number(),
		user: z.string(),
		password: z.string(),
		database: z.string(),
	});