import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "@/util/db";
import { ObjectId } from "mongodb";
import { deletePoem } from "@/controller/delete_poem";
import { updatePoem } from "@/controller/update_poem";
import { getPoem } from "@/controller/get_Poem";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const { db } = await connectToDatabase();

  console.log({ "sss----->": session });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const poemId = req.query.poem_id as string;

  if (req.method === "DELETE") {
    try {
      const result = await deletePoem(poemId, session);

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Poem not found" });
      }

      return res.status(200).json({ message: "Poem deleted successfully" });
    } catch (error) {
      console.error((error as Error).message);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { title, description } = req.body;

      if (!poemId || !title || !description) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const poem = await db.collection("poems").findOne({
        _id: new ObjectId(poemId),
        author: new ObjectId(session.user.id),
      });

      if (!poem) {
        res.status(404).json({ error: "poem not found" });
        return;
      }

      await updatePoem(poemId, { title, description });

      res.status(200).json({ message: "Poem updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      let poem = await getPoem(poemId);
      res.status(200).json(poem);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
