import { PoemType } from "@/model/Types";
import styles from '../styles/Poem.module.css';

type PropType = {
    poem : PoemType;
}

export function Poem({poem} : PropType){
    return <div className={styles.poem}>
        <p>{poem.title}</p>
        <p>{poem.description}</p>
    </div>
}

