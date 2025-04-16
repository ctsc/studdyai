// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgresql://postgres.uxjxdddvtofnegseprho:studybuddyai@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  },
});
