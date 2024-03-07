//
// Imports
//

import cron from "node-cron";

import { doBackup } from "./functions/do-backup.js";

import { configuration } from "./instances/configuration.js";

//
// Script
//

if (configuration.cronConfiguration == null)
{
	await doBackup();
}
else
{
	if (configuration.cronConfiguration.runAtStartup)
	{
		console.log("[Index] Performing startup run...");

		await doBackup();
	}

	cron.schedule(configuration.cronConfiguration.expression,
		async () =>
		{
			await doBackup();
		});

	console.log("[Index] Scheduled cron job with expression: " + configuration.cronConfiguration.expression);
}