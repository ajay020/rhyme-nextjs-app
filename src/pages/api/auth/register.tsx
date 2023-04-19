import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/util/db";

interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
}

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { name, email, password }: SignUpRequestBody = req.body;

  // Check if user already exists
  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" }); // Conflict
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert new user into database
  const newUser = { name, email, password: hashedPassword };
  const result = await usersCollection.insertOne(newUser);

  // Return success response
  return res
    .status(201)
    .json({ message: "User created successfully", id: result.insertedId });
};

export default handler;
