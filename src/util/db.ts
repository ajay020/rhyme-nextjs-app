import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions;

  const client = await MongoClient.connect(uri, options);
  await client.connect();

  const db = client.db(process.env.MONGO_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
