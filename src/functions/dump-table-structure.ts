//
// Imports
//

import child_process from "node:child_process";
import path from "node:path";

import { configuration } from "../instances/configuration.js";

//
// Function
//

export async function dumpTableStructure(tableName : string) : Promise<void>
{
	const outputPath = path.join(configuration.outputPath, "structure", tableName + ".sql");

	const commandComponents =
		[
			`"${ configuration.mysqlDumpPath }"`,
			`--host ${ configuration.databaseConfiguration.host }`,
			`--port ${ configuration.databaseConfiguration.port }`,
			`--user ${ configuration.databaseConfiguration.user }`,
			`--password=${ configuration.databaseConfiguration.password }`,
			`--no-data`,
			`--set-gtid-purged=OFF`,
			`--single-transaction`,
			`--no-tablespaces`,
			`--skip-add-drop-table`,
			configuration.databaseConfiguration.database,
			tableName,
			`> "${ outputPath }"`,
		];

	return new Promise(
		(resolve, reject) =>
		{
			child_process.exec(commandComponents.join(" "),
				(error) =>
				{
					if (error != null)
					{
						reject(error);
					}

					resolve();
				});
		});

}