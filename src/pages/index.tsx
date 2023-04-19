import { useState, useEffect } from "react";
import Head from "next/head";
import { PoemType } from "@/model/Types";
import { Poem } from "@/components/Poem";
import styles from "@/styles/Home.module.css";
import Spinner from "@/components/Spinner";
import { connectToDatabase } from "@/util/db";

type PropTypes = {
  poems: PoemType[];
  error: string;
};

export default function Home({ poems, error }: PropTypes) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  });

  return (
    <>
      <Head>
        <title>Rhyme app</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {loading && <Spinner loading={loading} />}
        {error && <h2>{error}</h2>}
        {poems?.length == 0 && <h2>No Poem found, Write one.</h2>}

        {poems?.map((poem) => (
          <Poem poem={poem} key={poem._id} />
        ))}
      </main>
    </>
  );
}

export async function getStaticProps() {
  try {
    const { db } = await connectToDatabase();

    const poems = await db.collection("poems").find({}).limit(10).toArray();
    poems.reverse();
    return {
      props: {
        poems: JSON.parse(JSON.stringify(poems)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: (e as Error).message,
      },
    };
  }
}
