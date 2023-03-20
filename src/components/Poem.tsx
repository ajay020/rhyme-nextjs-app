import { PoemType } from "@/model/Types";
import Link from "next/link";
import styles from "../styles/Poem.module.css";

type PropType = {
  poem: PoemType;
};

export function Poem({ poem }: PropType) {
  return (
    <Link href={"/poem/" + poem._id} legacyBehavior>
      <a className={styles.poem}>
        <div className={styles.poem_body}>
          <h3>{poem.title}</h3>
          <p>{`${poem.description.substring(0, 60)}...`}</p>
        </div>
      </a>
    </Link>
  );
}
