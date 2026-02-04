const { Client } = require('pg');
const url = "postgresql://postgres.jjbgfdtdjwfraiqtrzrs:FACUDUARTE120@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
async function test() {
    const client = new Client({ connectionString: url });
    try {
        await client.connect();
        console.log("SUCCESS");
        await client.end();
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
test();
