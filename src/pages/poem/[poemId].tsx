import { useContext, useState, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

import { useRouter } from "next/router";
import { PoemType } from "@/model/Types";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../../styles/SinglePoem.module.css";
import { AuthContext } from "../../components/AuthProvider";
import { BASE_URL } from "@/common/config";
import Link from "next/link";
import Spinner from "@/components/Spinner";

interface Props {
  poem: PoemType;
}

export default function SinglePoem({ poem }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(false);
  });

  const deletePoem = async () => {
    try {
      const userString = localStorage.getItem("user");
      let user;
      if (userString) {
        user = JSON.parse(userString);
      }

      const response = await fetch(BASE_URL + `/api/poem/${poem._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
      });
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
        {user?._id == poem.author?._id && (
          <div className={styles.actions}>
            <Link className={styles.btn} href={`/update-poem/${poem._id}`}>
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
        <p>{poem.description}</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}: GetServerSidePropsContext<ParsedUrlQuery>) => {
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
    const response = await fetch(BASE_URL + `/api/poem/${poemId}`);
    poem = await response.json();
  } catch (error) {}

  // Pass the post data as props to the component
  return {
    props: {
      poem,
    },
  };
};
