import { connectToDatabase } from "@/util/db";
import { ObjectId } from "mongodb";

export async function getPoem(poemId: string) {
  const { db } = await connectToDatabase();

  const result = await db
    .collection("poems")
    .aggregate([
      {
        $match: {
          _id: new ObjectId(poemId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
    ])
    .toArray();

  let poem = result[0];
  return poem;
}
