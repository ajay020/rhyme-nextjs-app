import { PoemType } from "@/model/Types";
import styles from '../styles/Poem.module.css';

type PropType = {
    poem : PoemType;
}

export function Poem({poem} : PropType){
    return <a href= {"/poem/" + poem._id}  className={styles.poem}>
         <div className={styles.poem_body} >
            <h3>{poem.title}</h3>
            <hr />
            
            <p>{poem.description}</p>
         </div>
    </a>
}

