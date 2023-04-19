import { Schema, model } from "mongoose";

interface MyModel {
  title: string;
  description: string;
}

const MySchema = new Schema<MyModel>({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export const Poem = model<MyModel>("Poem", MySchema);
