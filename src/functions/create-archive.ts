//
// Imports
//

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

import archiver from "archiver";

import { configuration } from "../instances/configuration.js";

//
// Function
//

export async function createArchive() : Promise<string>
{
	//
	// Create Tar
	//

	console.log("[CreateArchive] Creating TAR archive...");

	const tarOutputPath = path.join(configuration.outputPath, "sql.tar");

	const tarWriteStream = fs.createWriteStream(tarOutputPath);

	const tarArchive = archiver("tar");

	tarArchive.pipe(tarWriteStream);

	tarArchive.directory(path.join(configuration.outputPath, "data"), "data");

	tarArchive.directory(path.join(configuration.outputPath, "structure"), "structure");

	await tarArchive.finalize();

	//
	// Gzip Tar
	//

	console.log("[CreateArchive] Compressing TAR archive using Gzip...");

	const tarReadStream = fs.createReadStream(tarOutputPath);

	const gzipOutputPath = tarOutputPath + ".gz";

	const gzipWriteSteam = fs.createWriteStream(gzipOutputPath);

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
						resolve(gzipOutputPath);
					});
		});
}