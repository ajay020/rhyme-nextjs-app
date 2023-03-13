import styles from "../styles/WritePoem.module.css";
import { useState, FormEvent } from "react";
import { useRouter } from 'next/router';

const BASE_URL = "http://localhost:8000";

interface UserData {
    name:string,
    email:string,
    token:string
}

export default function WritePoem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const submitPoem = async (e :FormEvent) =>{
        e.preventDefault();

        let userString = localStorage.getItem('user');
        let user;

        if(userString){
            user = JSON.parse(userString) as UserData;
        }

        try {
            if(title && description && user){
                const poem = {title, description};
                const response  = await fetch(BASE_URL + "/api/poem" , {
                    method: 'post', 
                    headers :{
                        'Content-Type' : 'application/json',
                        'authorization' : 'Bearer ' + user?.token
                    },
                    body: JSON.stringify(poem)
                });
                const data = await response.json();
                router.push('/');
                // console.log(data);
            }
        } catch (error:any) {
            console.log(error.message);
        }
  }

  return (
    <div className={styles.write_poem}>
      <form onSubmit={submitPoem}>
        <div className={styles.form_group}>
          <input
           type="text" 
           placeholder="Post title" 
           onChange={(e) => setTitle(e.target.value)} />
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
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
}
