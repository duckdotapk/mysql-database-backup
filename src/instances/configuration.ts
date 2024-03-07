//
// Imports
//

import fs from "node:fs";
import path from "node:path";

import YAML from "yaml";

import { ConfigurationSchema } from "../types/Configuration.js";

//
// Configuration
//

const rawConfigurationText = await fs.promises.readFile(path.join(process.cwd(), "configuration.yml"),
	{
		encoding: "utf-8",
	});

const rawConfiguration = YAML.parse(rawConfigurationText);

export const configuration = ConfigurationSchema.parse(rawConfiguration);