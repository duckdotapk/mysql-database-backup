# MySQL Database Backup
This repo contains a Node.js utility I created for backing up a MySQL database's structure and data.

It backs up each table's structure and data separately, creates an archive, gzips it, and uploads the backup to a private S3 bucket.

This is obviously a bit specific to my use case but if you need this tweaked for your use case, maybe open an issue or a pull request.

## Configuration
Configuration is done via a `configuration.yml` file placed into the folder.

Maybe I'll document configuration options at some point but the configuration is parsed with [zod](https://www.npmjs.com/package/zod) so see `src/types` for more details, for now.

## License
[MIT](https://github.com/duckdotapk/mysql-database-backup/blob/main/LICENSE.md)