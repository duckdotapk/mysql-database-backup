//
// Imports
//

import { z } from "zod";

import { CronConfigurationSchema } from "./CronConfiguration.js";
import { DatabaseConfigurationSchema } from "./DatabaseConfiguration.js";
import { S3ConfigurationSchema } from "./S3Configuration.js";
import { SMTPConfigurationSchema } from "./SMTPConfiguration.js";

//
// Type
//

export type Configuration = z.infer<typeof ConfigurationSchema>;

export const ConfigurationSchema = z.object(
	{
		cronConfiguration: CronConfigurationSchema.optional(),

		databaseConfiguration: DatabaseConfigurationSchema,

		defaultInclusion: z.enum([ "exclude", "include" ]).default("include"),

		mysqlDumpPath: z.string(),

		outputPath: z.string(),

		s3Configurations: z.array(S3ConfigurationSchema),

		smtpConfiguration: SMTPConfigurationSchema,

		tables: z.array(z.string()).default([]),
	});