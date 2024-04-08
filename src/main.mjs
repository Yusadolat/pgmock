import { PostgresMock } from "pgmock";
import knex from 'knex';

(async () => {
  console.log("Starting Postgres mock server...");

  const mock = await PostgresMock.create();
  const connectionString = await mock.listen(0);

  console.log(`Postgres mock is now listening on ${connectionString}`);
  console.log(`To access: psql ${connectionString}`);

  try {
    // Create a Knex instance using the connection string
    const db = knex({
      client: "pg",
      connection: connectionString,
    });

    // Test the connection
    await db.raw("SELECT 1");
    console.log("Connected to Postgres mock server successfully!");

    // Create a table
    await db.schema.createTable("users", (table) => {
      table.increments("id");
      table.string("name");
      table.string("email");
    });

    // Example insert
    await db("users").insert({ name: "John Doe", email: "john@example.com" });

    // Example query
    const users = await db("users").select("*");
    console.log("Users:", users);

    // Example update
    await db("users").where("id", 1).update({ email: "newemail@example.com" });

    // Example delete
    await db("users").where("id", 1).del();

    // Close the database connection
    await db.destroy();
  } catch (err) {
    console.error("Error connecting to Postgres mock server:", err);
  }
})().catch(console.error);
