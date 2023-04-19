import { Session } from "next-auth";
import { connectToDatabase } from "@/util/db";
import { Db, ObjectId } from "mongodb";

type DataType = {
  title: string;
  description: string;
};

export async function updatePoem(poemId: string, data: DataType) {
  const { db } = await connectToDatabase();

  await db
    .collection("poems")
    .updateOne({ _id: new ObjectId(poemId) }, { $set: data });
}
