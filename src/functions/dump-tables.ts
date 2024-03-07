//
// Imports
//

import { dumpTableData } from "./dump-table-data.js";
import { dumpTableStructure } from "./dump-table-structure.js";

//
// Function
//

export async function dumpTables(tableNames : string[]) : Promise<void>
{
	for (const [ tableNameIndex, tableName ] of tableNames.entries())
	{
		console.log("[DumpTables] [" + (tableNameIndex + 1) + "/" + tableNames.length + "] Dumping " + tableName + "...");

		await dumpTableStructure(tableName);

		await dumpTableData(tableName);
	}
}