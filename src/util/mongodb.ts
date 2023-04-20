import { Db, MongoClient, MongoClientOptions } from "mongodb";

export function getAdapterConfig() {
  if (!process.env.MONGODB_URI) {
    return;
  }

  // Create a MongoDB client
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions);
  // Connect to MongoDB
  client
    .connect()
    .then(() => {
      // Success! MongoDB connected
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      // Error connecting to MongoDB
      console.error("Failed to connect to MongoDB", error);
    });

  // Define the adapter configuration
  const adapterConfig = {
    db: client.db(process.env.MONGO_DB) as Db,
  };

  return adapterConfig;
}
