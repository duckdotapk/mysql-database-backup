//
// Imports
//

import fs from "node:fs";
import path from "node:path";

import { rimraf } from "rimraf";

import { configuration } from "../instances/configuration.js";

//
// Function
//

export async function createOutputDirectories() : Promise<void>
{
	console.log("[CreateOutputDirectories] Removing old output directories...");

	await rimraf(configuration.outputPath);

	console.log("[CreateOutputDirectories] Creating new output directories...");

	const dataPath = path.join(configuration.outputPath, "data");

	await fs.promises.mkdir(dataPath,
		{
			recursive: true,
		});

	const structurePath = path.join(configuration.outputPath, "structure");

	await fs.promises.mkdir(structurePath,
		{
			recursive: true,
		});
}