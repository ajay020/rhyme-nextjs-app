import { Session } from "next-auth";
import { connectToDatabase } from "@/util/db";
import { Db, ObjectId } from "mongodb";

export async function deletePoem(poemId: string, session: Session) {
  const { db } = await connectToDatabase();

  const result = await db.collection("poems").deleteOne({
    _id: new ObjectId(poemId),
    author: new ObjectId(session.user.id),
  });

  return result;
}
