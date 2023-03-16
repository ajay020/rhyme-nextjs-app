import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

import { useRouter } from "next/router";
import { PoemType } from "@/model/Types";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from "../../styles/SinglePoem.module.css";

const BASE_URL = "http://localhost:8000";

interface Props {
  poem: PoemType;
}

export default function SinglePoem({ poem }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const deletePoem = async () => {
    try {
      const userString = localStorage.getItem("user");
      let user;
      if (userString) {
        user = JSON.parse(userString);
        console.log(user);
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
      <div className={styles.header}>
      <div className={styles.actions}>
          <a href={`/update-poem/${poem._id}`} className={styles.btn}>
            <FontAwesomeIcon
             style={{ fontSize: 14, color: "black" }}
             icon={faEdit} />
          </a>
          <a href="#" onClick={deletePoem} className={styles.btn}>
            <FontAwesomeIcon
              icon={faTrash}
              style={{ fontSize: 14, color: "black" }}
            />
          </a>
        </div>
        <h3>{poem.title}</h3>
        <p>{poem?.author?.name}</p>
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

  if (params && typeof params.poemId == "string") {
    poemId = params.poemId;
  }

  if (!poemId) {
    return {
      notFound: true,
    };
  }

  const response = await fetch(BASE_URL + `/api/poem/${poemId}`);
  const poem = await response.json();

  // console.log(poem);

  // Pass the post data as props to the component
  return {
    props: {
      poem,
    },
  };
};
