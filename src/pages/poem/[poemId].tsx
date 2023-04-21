import { useState, useEffect } from "react";
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPaths,
  GetStaticPropsResult,
  GetStaticPathsResult,
} from "next";
import { ParsedUrlQuery } from "querystring";

import { useRouter } from "next/router";
import { PoemType } from "@/model/Types";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../../styles/SinglePoem.module.css";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { connectToDatabase } from "@/util/db";
import { useSession } from "next-auth/react";
import { getPoem } from "@/controller/get_Poem";

interface Props {
  poem: PoemType | null;
}

interface Params extends ParsedUrlQuery {
  poemId: string;
}

export default function SinglePoem({ poem }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    setLoading(false);
  }, []);

  const deletePoem = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_APP_URL + `/api/poem/${poem?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      alert("Poem Deleted!");
      router.push("/");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Spinner loading={loading} />
      <div className={styles.header}>
        {session?.user?.id == poem?.author?._id && (
          <div className={styles.actions}>
            <Link className={styles.btn} href={`/update-poem/${poem?._id}`}>
              <FontAwesomeIcon
                style={{ fontSize: 14, color: "black" }}
                icon={faEdit}
              />
            </Link>
            <Link className={styles.btn} onClick={deletePoem} href="#">
              <FontAwesomeIcon
                icon={faTrash}
                style={{ fontSize: 14, color: "black" }}
              />
            </Link>
          </div>
        )}

        <h3>{poem?.title}</h3>
        <p>~{poem?.author?.name}</p>
      </div>

      <div className={styles.body}>
        <p>{poem?.description}</p>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async (): Promise<
  GetStaticPathsResult<Params>
> => {
  try {
    const { db } = await connectToDatabase();

    const poemCollection = db.collection("poems");

    const poems = await poemCollection
      .find({}, { projection: { _id: 1 } })
      .toArray();

    const paths = poems.map((poem) => ({
      params: { poemId: poem._id.toString() },
    }));

    return {
      fallback: true,
      paths,
    };
  } catch (error) {
    console.error("Error fetching paths:", error);
    return {
      fallback: true,
      paths: [],
    };
  }
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}: GetStaticPropsContext<Params>): Promise<GetStaticPropsResult<Props>> => {
  try {
    if (!params || !params.poemId) {
      return { notFound: true };
    }

    let poem = await getPoem(params.poemId);

    if (!poem) {
      return { notFound: true };
    }

    console.log({ poem });

    return {
      props: {
        poem: {
          _id: poem._id.toString(),
          title: poem.title,
          description: poem.description,
          author: JSON.parse(JSON.stringify(poem?.author)),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching poem:", error);
    return {
      props: {
        poem: null,
      },
    };
  }
};
