import { PoemType } from "@/model/Types";
import styles from '../styles/Poem.module.css';

type PropType = {
    poem : PoemType;
}

export function Poem({poem} : PropType){
    return <div className={styles.poem}>
        <h3>{poem.title}</h3>
        <hr />
        
        <p>{poem.description}</p>
    </div>
}

