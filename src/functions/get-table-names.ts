//
// Imports
//

import { configuration } from "../instances/configuration.js";
import { connectionPool } from "../instances/connection-pool.js";

//
// Function
//

export async function getTableNames() : Promise<string[]>
{
	console.log("[GetTableNames] Getting table names from database...");

	const [ rawTableRows ] = await connectionPool.query(`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?;`,
		[
			configuration.databaseConfiguration.database,
		]) as unknown as [ { TABLE_NAME : string }[] ];

	let tableNames = rawTableRows.map(rawTableRow => rawTableRow.TABLE_NAME);

	console.log("[GetTableNames] Got " + tableNames.length + " table names.");

	if (configuration.defaultInclusion == "exclude")
	{
		tableNames = tableNames.filter(tableName => configuration.tables.includes(tableName));
	}
	else
	{
		tableNames = tableNames.filter(tableName => !configuration.tables.includes(tableName));
	}

	console.log("[GetTableNames] Filtered to " + tableNames.length + " table names using configuration.");

	if (tableNames.length == 0)
	{
		throw new Error("No tables to dump.");
	}

	return tableNames;
}