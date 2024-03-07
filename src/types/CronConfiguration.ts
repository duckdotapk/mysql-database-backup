//
// Imports
//

import { z } from "zod";

//
// Type
//

export type CronConfiguration = z.infer<typeof CronConfigurationSchema>;

export const CronConfigurationSchema = z.object(
	{
		expression: z.string(),
		runAtStartup: z.boolean().default(false),
	});