import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faAdd, faUser} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className={styles.navbar}>
      <h3 className={styles.brand_title}>
        <a href="/"> Rhyme</a>
      </h3>

      <div className={styles.write_poem}>
        <a href="/write_poem">
          <span>Write</span>
          <FontAwesomeIcon
              icon={faAdd}
              style={{ fontSize: 14, color: "white" }}
        />
        </a>
      </div>

      <div className={styles.user_icon}>
        <FontAwesomeIcon
              icon={faUser}
              style={{ fontSize: 14, color: "white" }}
        />
      </div>

    </div>)
}
