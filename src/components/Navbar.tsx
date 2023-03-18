import { useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dialog = document.querySelector(".dialog");
      const userIcon = document.querySelector(".user");

      if (
        dialog &&
        !dialog.contains(event.target as Node) &&
        event.target !== userIcon &&
        !userIcon?.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
            <li className="user">
              <div className={styles.user_icon} onClick={handleUserIconClick}>
                <FontAwesomeIcon
                  id="userIcon"
                  icon={faUser}
                  style={{ fontSize: 18 }}
                />
              </div>
            </li>
          </>
        )}
      </ul>
      <div className="dialog">
        {visible && user && <UserPopup user={user} />}
      </div>
    </nav>
  );
}
