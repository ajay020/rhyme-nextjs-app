import { PoemType } from "@/model/Types";
import Link from "next/link";
import styles from "../styles/Poem.module.css";

type PropType = {
  poem: PoemType;
};

export function Poem({ poem }: PropType) {
  return (
    <Link className={styles.poem} href={"/poem/" + poem._id}>
      <div className={styles.poem_body}>
        <h3>{poem.title}</h3>
        <p>{`${poem.description.substring(0, 50)}...`}</p>
      </div>
    </Link>
  );
}
