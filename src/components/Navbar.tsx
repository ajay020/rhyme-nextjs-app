import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Navbar.module.css";
import UserPopup from "./UserPopup";

const BASE_URL = "http://localhost:8000";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  const handleUserIconClick = () => {
    setVisible(!visible);
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.brand}>
          <a href="/">Rhyme</a>
        </li>
        {!user && (
          <li className={styles.register_link}>
            <a href={"/register"}>Register</a>
          </li>
        )}

        {user && (
          <>
            {" "}
            <li className={styles.write_link}>
              <div className={styles.write_poem}>
                <a href="/write_poem">
                  <span>Write</span>
                  <FontAwesomeIcon icon={faAdd} style={{ fontSize: 14 }} />
                </a>
              </div>
            </li>
            <li>
              <div className={styles.user_icon} onClick={handleUserIconClick}>
                <FontAwesomeIcon icon={faUser} style={{ fontSize: 14 }} />
              </div>
            </li>
          </>
        )}
      </ul>
      {visible && user && <UserPopup user={user} />}
    </nav>
  );
}
