//
// Imports
//

import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

import archiver from "archiver";
import mysql2 from "mysql2/promise.js";

//
// Types
//

export type ArchiveDirectory =
{
	name: string;
	path: string;
}

export type DumpStep = 
	RemovingOldOutputDirectoryDumpStep | 
	CreatingNewOutputDirectoriesDumpStep |
	GettingTableNamesDumpStep |
	DumpingTablesDumpStep |
	DumpingTableDumpStep |
	CreatingArchiveDumpStep;

export type RemovingOldOutputDirectoryDumpStep =
{
	type: "removingOldOutputDirectory";
}

export type CreatingNewOutputDirectoriesDumpStep =
{
	type: "creatingNewOutputDirectories";
}

export type GettingTableNamesDumpStep =
{
	type: "gettingTableNames";
}

export type DumpingTablesDumpStep =
{
	type: "dumpingTables";
	tableNames: string[];
}

export type DumpingTableDumpStep =
{
	type: "dumpingTable";
	tableName: string;
}

export type CreatingArchiveDumpStep =
{
	type: "creatingArchive";
}

//
// Utility Functions
//

export type CreateArchiveOptions =
{
	outputDirectory: string;
	directories: ArchiveDirectory[];
}

export async function createArchive(options: CreateArchiveOptions) : Promise<string>
{
	//
	// Create Tar
	//

	const tarFileName = path.join(options.outputDirectory + ".tar");

	const tarWriteStream = fs.createWriteStream(tarFileName);

	const tarArchive = archiver("tar");

	tarArchive.pipe(tarWriteStream);

	for (const directory of options.directories)
	{
		tarArchive.directory(directory.path, directory.name);
	}

	await tarArchive.finalize();

	//
	// Gzip Tar
	//

	const tarReadStream = fs.createReadStream(tarFileName);

	const gzipFileName = tarFileName + ".gz";

	const gzipWriteSteam = fs.createWriteStream(gzipFileName);

	const gzip = zlib.createGzip();

	return new Promise(
		(resolve, reject) =>
		{
			tarReadStream
				.pipe(gzip)
				.pipe(gzipWriteSteam)
				.on("error",
					() =>
					{
						reject();
					})
				.on("finish",
					() =>
					{
						resolve(gzipFileName);
					});
		});
}

export type DumpOptions =
{
	mysqlDumpPath: string;
	outputPath: string;

	databaseUrl: URL;
	defaultInclusion?: "exclude" | "include";
	tables?: string[];

	onStep?: (step: DumpStep) => Promise<void>;
}

export type DumpResult = DumpResultFailure | DumpResultSuccess;

export type DumpResultFailure =
{
	success: false;
	error: Error | null;
}

export type DumpResultSuccess =
{
	success: true;
	startTimestamp: number;
	endTimestamp: number;
	duration: number;
	tableNames: string[];
	archiveFilePath: string;
}

export async function dump(options: DumpOptions) : Promise<DumpResult>
{
	const defaultInclusion = options.defaultInclusion ?? "exclude";

	const tables = options.tables ?? [];

	const onStep = options.onStep ?? (async () => {});

	const step = async (step: DumpStep) =>
	{
		await onStep(step);
	}

	try
	{
		//
		// Get Start Date
		//

		const startDate = new Date();

		//
		// Remove Old Output Directory
		//

		await step({ type: "removingOldOutputDirectory" });

		await fs.promises.rm(options.outputPath, { recursive: true, force: true });

		//
		// Create New Output Directories
		//

		await step({ type: "creatingNewOutputDirectories" });

		await fs.promises.mkdir(path.join(options.outputPath, "data"), { recursive: true });

		await fs.promises.mkdir(path.join(options.outputPath, "structure"), { recursive: true });

		//
		// Get Table Names
		//

		await step({ type: "gettingTableNames" });

		let tableNames = await getTableNames(options.databaseUrl);

		switch (defaultInclusion)
		{
			case "exclude":
			{
				tableNames = tableNames.filter((tableName) => !tables.includes(tableName));

				break;
			}

			case "include":
			{
				tableNames = tableNames.filter((tableName) => tables.includes(tableName));

				break;
			}
		}

		//
		// Dump Tables
		//

		await step({ type: "dumpingTables", tableNames });

		for (const tableName of tableNames)
		{
			await step({ type: "dumpingTable", tableName });

			await dumpTableStructure(
				{
					databaseUrl: options.databaseUrl,
					outputPath: path.join(options.outputPath, "data", tableName + ".sql"),
					mysqlDumpPath: options.mysqlDumpPath,
					tableName,
				});

			await dumpTableData(
				{
					databaseUrl: options.databaseUrl,
					outputPath: path.join(options.outputPath, "structure", tableName + ".sql"),
					mysqlDumpPath: options.mysqlDumpPath,
					tableName,
				});
		}

		//
		// Create .tar.gz Archive
		//

		await step({ type: "creatingArchive" });

		const archiveFilePath = await createArchive(
			{
				outputDirectory: options.outputPath,
				directories:
				[
					{ name: "data", path: path.join(options.outputPath, "data") },
					{ name: "structure", path: path.join(options.outputPath, "structure") },
				]
			});
		
		//
		// Get End Date
		//

		const endDate = new Date();

		//
		// Get Timestamps & Duration
		//

		const startTimestamp = Math.floor(startDate.getTime() / 1000);

		const endTimestamp = Math.floor(endDate.getTime() / 1000);

		const duration = endTimestamp - startTimestamp;

		//
		// Return
		//

		return {
			success: true,
			startTimestamp,
			endTimestamp,
			duration,
			tableNames,
			archiveFilePath,
		};
	}
	catch (error)
	{
		return {
			success: false,
			error: error instanceof Error ? error : null,
		};
	}
}

export type DumpTableDataOptions =
{
	databaseUrl: URL;
	outputPath: string;
	mysqlDumpPath: string;
	tableName: string;
}

export async function dumpTableData(options: DumpTableDataOptions) : Promise<void>
{
	const commandComponents =
		[
			`"${ options.mysqlDumpPath }"`,
			`--host ${ options.databaseUrl.hostname }`,
			`--port ${ options.databaseUrl.port }`,
			`--user ${ options.databaseUrl.username }`,
			`--password=${ options.databaseUrl.password }`,
			`--no-create-info`,
			`--set-gtid-purged=OFF`,
			`--single-transaction`,
			`--no-tablespaces`,
			options.databaseUrl.pathname.substring(1),
			options.tableName,
			`> "${ options.outputPath }"`,
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

export type DumpTableStructureOptions =
{
	databaseUrl: URL;
	outputPath: string;
	mysqlDumpPath: string;
	tableName: string;
}

export async function dumpTableStructure(options: DumpTableStructureOptions) : Promise<void>
{
	const commandComponents =
		[
			`"${ options.mysqlDumpPath }"`,
			`--host ${ options.databaseUrl.hostname }`,
			`--port ${ options.databaseUrl.port }`,
			`--user ${ options.databaseUrl.username }`,
			`--password=${ options.databaseUrl.password }`,
			`--no-data`,
			`--set-gtid-purged=OFF`,
			`--single-transaction`,
			`--no-tablespaces`,
			`--skip-add-drop-table`,
			options.databaseUrl.pathname.substring(1),
			options.tableName,
			`> "${ options.outputPath }"`,
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

export async function getTableNames(databaseUrl: URL): Promise<string[]>
{
	const connection = await mysql2.createConnection(
		{
			uri: databaseUrl.toString(),
			dateStrings: true,
		});

	const databaseName = databaseUrl.pathname.substring(1);

	const [ rawTableRows ] = await connection.query(`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?;`,
		[
			databaseName,
		]) as unknown as [ { TABLE_NAME : string }[] ];

	let tableNames = rawTableRows.map(rawTableRow => rawTableRow.TABLE_NAME);

	return tableNames;
}