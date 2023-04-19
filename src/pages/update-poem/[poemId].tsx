import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { PoemType } from "@/model/Types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import styles from "../../styles/UpdatePoem.module.css";
import { BASE_URL } from "@/common/config";
import Spinner from "@/components/Spinner";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { getPoem } from "@/controller/get_Poem";
import { InferGetServerSidePropsType } from "next";

interface Props {
  poem: PoemType;
}

export default function UpdatePoem({
  poem,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [title, setTitle] = useState(poem?.title || "");
  const [description, setDescription] = useState(poem?.description || "");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  if (typeof window === "undefined") return null;

  if (!session) {
    return <p>You are not LoggedIN</p>;
  }

  const router = useRouter();

  const updatePoem = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (title && description) {
        setLoading(true);
        const response = await fetch(BASE_URL + `/api/poem/${poem._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        });

        const data = await response.json();
        console.log({ data });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Update Poem</h3>
      <Spinner loading={loading} />
      <form onSubmit={updatePoem}>
        <div className={styles.form_group}>
          <input
            type="text"
            value={title}
            placeholder="Post title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <textarea
            placeholder="Write here..."
            name="description"
            value={description}
            cols={20}
            rows={10}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.form_group}>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  req,
  res,
}: GetServerSidePropsContext<ParsedUrlQuery>) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let poemId: string | undefined;

  let poem;

  try {
    if (params && typeof params.poemId == "string") {
      poemId = params.poemId;
    }

    if (!poemId) {
      return {
        notFound: true,
      };
    }

    poem = await getPoem(poemId);
  } catch (error: any) {
    console.log(error.message);
  }

  // Pass the post data as props to the component
  return {
    props: {
      poem: JSON.parse(JSON.stringify(poem)),
    },
  };
};
