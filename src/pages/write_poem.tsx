import styles from "../styles/WritePoem.module.css";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function WritePoem() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    router.push("/api/auth/signin");
  }

  const submitPoem = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (title && description && session) {
        setLoading(true);
        const poem = { title, description };

        const response = await fetch(
          process.env.NEXT_PUBLIC_APP_URL + "/api/poem",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(poem),
          }
        );

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const data = await response.json();
        router.push("/");
      }
    } catch (error) {
      console.log((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.write_poem}>
      <h3>Write A Poem</h3>
      <Spinner loading={loading} />
      <form onSubmit={submitPoem}>
        <div className={styles.form_group}>
          <input
            type="text"
            placeholder="Post title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <textarea
            placeholder="Write here..."
            name="description"
            cols={30}
            rows={10}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.form_group}>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req, res } = context;

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    // Redirect to login page if session is not found
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  // Pass session data to the protected page
  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  };
};
