//
// Imports
//

import humanizeDuration from "humanize-duration";
import { DateTime } from "luxon";

import { createArchive } from "./create-archive.js";
import { createOutputDirectories } from "./create-output-directories.js";
import { dumpTables } from "./dump-tables.js";
import { getTableNames } from "./get-table-names.js";
import { uploadArchive } from "./upload-archive.js";

//
// Function
//

export async function doBackup()
{
	//
	// Start Log
	//

	const startTimeMilliseconds = DateTime.utc().toMillis();

	const startTimeFormatted = DateTime.fromMillis(startTimeMilliseconds).toLocaleString(DateTime.DATETIME_MED);

	console.log("[DoBackup] Starting backup at " + startTimeFormatted + "...");

	//
	// Do Backup
	//

	await createOutputDirectories();

	const tableNames = await getTableNames();

	await dumpTables(tableNames);

	const archivePath = await createArchive();

	await uploadArchive(archivePath);

	//
	// End Log
	//

	const endTimeMilliseconds = DateTime.utc().toMillis();

	const endTimeFormatted = DateTime.fromMillis(endTimeMilliseconds).toLocaleString(DateTime.DATETIME_MED);

	const durationMilliseconds = endTimeMilliseconds - startTimeMilliseconds;

	const durationFormatted = humanizeDuration(durationMilliseconds);

	console.log("[SyncAllTables] Backup completed at " + endTimeFormatted + " in " + durationFormatted + ".");
}