//
// Imports
//

import { z } from "zod";

//
// Type
//

export type SMTPConfiguration = z.infer<typeof SMTPConfigurationSchema>;

export const SMTPConfigurationSchema = z.object(
	{
		host: z.string(),
		port: z.number(),
		username: z.string(),
		password: z.string(),
		recipients: z.array(z.string()),
	});