# Database Scripts

This directory contains SQL and CQL scripts used to manage the database aspects of our application. These scripts are essential for setting up databases, creating tables, and running queries.

## Files and Descriptions

- `cassandra_queries.cql`: Contains CQL (Cassandra Query Language) commands for querying the Cassandra database tables, including data retrieval, updates, and aggregation operations.
- `cassandra_setup.cql`: Includes CQL statements for setting up the Cassandra database environment, such as creating keyspaces, tables, and configuring database settings.
- `queries.sql`: Standard SQL queries for interacting with traditional relational databases. This file typically includes SELECT, UPDATE, INSERT, and DELETE commands.
- `tables.sql`: Contains SQL statements for creating and altering table structures within a relational database. This script is crucial for initial database setup and schema migrations.

## Usage

Ensure that you have the appropriate database systems installed and running (Cassandra for `.cql` files and a SQL-compatible database for `.sql` files).

To run the `.cql` files, you can use the `cqlsh` command-line tool provided by Cassandra. For `.sql` files, use a SQL database client compatible with your relational database system (like `psql` for PostgreSQL or `mysql` for MySQL databases).

Please refer to each script for specific instructions and configurations required for your setup. It is recommended to review and adjust the scripts as per your database schema and requirements before executing them.

---

For any assistance with these database scripts or to report issues, please reach out to the database administration team or open an issue in the repository.
