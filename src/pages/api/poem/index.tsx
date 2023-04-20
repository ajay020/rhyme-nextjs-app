import { connectToDatabase } from "@/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

interface Poem {
  title: string;
  description: string;
  author: ObjectId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // connect to the database
      const { db } = await connectToDatabase();
      const { title, description } = req.body;

      // create the post object
      const poem: Poem = {
        title,
        description,
        author: new ObjectId(session.user.id),
      };

      const result = await db.collection("poems").insertOne(poem);

      res.json(result);
    } catch (e) {
      console.error(e);
    }
  }
}
