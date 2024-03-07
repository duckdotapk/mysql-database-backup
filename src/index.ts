//
// Imports
//

import { doBackup } from "./functions/do-backup.js";

import { connectionPool } from "./instances/connection-pool.js";

//
// Script
//

await doBackup();

await connectionPool.end();