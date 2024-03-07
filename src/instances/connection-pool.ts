//
// Imports
//

import mysql2 from "mysql2/promise.js";

import { configuration } from "./configuration.js";

//
// Connection Pools
//

export const connectionPool = mysql2.createPool(
	{
		host: configuration.databaseConfiguration.host,
		port: configuration.databaseConfiguration.port,
		user: configuration.databaseConfiguration.user,
		password: configuration.databaseConfiguration.password,
		database: configuration.databaseConfiguration.database,
		dateStrings: true,
	});