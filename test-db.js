const { Client } = require('pg');

const urls = [
    "postgresql://postgres.jjbgfdtdjwfraiqtrzrs:FACUDUARTE120@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    "postgresql://postgres.jjbgfdtdjwfraiqtrzrs:FACUDUARTE120@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
];

async function test() {
    for (const url of urls) {
        console.log(`Testing ${url}...`);
        const client = new Client({ connectionString: url });
        try {
            await client.connect();
            console.log("Success!");
            await client.end();
            process.exit(0);
        } catch (e) {
            console.error(`Failed: ${e.message}`);
        }
    }
}

test();
