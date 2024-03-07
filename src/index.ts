//
// Imports
//

import cron from "node-cron";

import { doBackup } from "./functions/do-backup.js";

import { connectionPool } from "./instances/connection-pool.js";
import { configuration } from "./instances/configuration.js";

//
// Script
//

if (configuration.cronConfiguration != null)
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
else
{
	await doBackup();

	await connectionPool.end();
}