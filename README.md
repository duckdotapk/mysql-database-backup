# MySQL Dump & Archive
A Node.js package for dumping MySQL databases and creating an archive of their contents.

This package uses [mysqldump](https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html) under the hood so it has to be installed somewhere on your system. The path is provided inline so it doesn't matter where.

## Documentation

```ts
import * as MySqlDumpArchive from "@lorenstuff/mysql-dump-archive";

const result = await MySqlDumpArchive.dump(
	{
		// Required: The path to the mysqldump executable.
		mySqlDumpPath: "/usr/bin/mysqldump",

		// Required: The output directory of the dump.
		//	Note: This will be fully replaced each time dump is called!
		//	Consider including a timestamp if you want to keep multiple dumps.
		outputPath: "/path/to/output/directory",

		// Required: Your database URL.
		databaseUrl: "mysql://user:password@host:port/database",

		// Optional: Whether to include or exclude tables by default.
		//	Valid values are "include" and "exclude".
		//	Defaults to "exclude".
		defaultInclusion: "exclude",

		// Optional: A list of table names to include/exclude from the dump.
		tables:
		[
			"SomeLogTableThatIsNotCritical",
		],

		// Optional: A callback called for each step of the dumping process.
		//	Certain steps may be called multiple times and some include extra data.
		//	You can perform checks on the "type" property to determine which step is happening.
		onDump: (step: MySqlDumpArchive.DumpStep) =>
		{
			console.log(step);
		},
	});

// Result will either have "success: true" with dump details
//	or "success: false" with an error object.
```

## License
[MIT](https://github.com/duckdotapk/mysql-database-backup/blob/main/LICENSE.md)