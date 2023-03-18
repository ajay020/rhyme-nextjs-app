import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Navbar.module.css";
import UserPopup from "./UserPopup";

const BASE_URL = "http://localhost:8000";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({
    top: 55,
    right: 10,
    left: 0,
  });

  const userIconRef = useRef<HTMLLIElement>(null);

  const handleUserIconClick = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dialogWrapper = document.querySelector("#dialogWrapper");
      const userIcon = document.querySelector(".user");

      if (
        dialogWrapper &&
        !dialogWrapper.contains(event.target as Node) &&
        event.target !== userIcon &&
        !userIcon?.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    }

    function updateDialogPosition() {
      if (userIconRef.current) {
        const { top, left, right, width } =
          userIconRef.current.getBoundingClientRect();
        setDialogPosition({
          top: top + width + 5,
          right: right - width / 2,
          left: left - width * 4,
        });
      }
    }

    window.addEventListener("resize", updateDialogPosition);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", updateDialogPosition);
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
            <li className={styles.write_link}>
              <div className={styles.write_poem}>
                <a href="/write_poem">
                  <span>Write</span>
                  <FontAwesomeIcon icon={faAdd} style={{ fontSize: 14 }} />
                </a>
              </div>
            </li>
            <li
              style={{ background: "red" }}
              className="user"
              ref={userIconRef}
            >
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
      <div
        style={{
          top: dialogPosition.top + "px",
          //   right: dialogPosition.right + "px",
          left: dialogPosition.left + "px",
        }}
        id="dialogWrapper"
        className={styles.dialogWrapper}
      >
        {visible && user && <UserPopup user={user} />}
      </div>
    </nav>
  );
}
