import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faFeatherPointed,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Navbar.module.css";
import UserPopup from "./UserPopup";
import Link from "next/link";

const BASE_URL = "http://localhost:8000";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({
    top: 55,
    left: 0,
    right: 10,
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
        const { top, left, width } =
          userIconRef.current.getBoundingClientRect();
        setDialogPosition({
          top: top + width + 5,
          left: left - width * 4,
          right: left,
        });
      }
    }

    updateDialogPosition();

    window.addEventListener("resize", updateDialogPosition);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", updateDialogPosition);
    };
  }, [visible]);

  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.brand}>
          <FontAwesomeIcon
            className={styles.logo}
            icon={faFeatherPointed}
            style={{ fontSize: 22 }}
          />
          <Link href="/" legacyBehavior>
            <a>Rhyme</a>
          </Link>
        </li>
        {!user && (
          <li className={styles.register_link}>
            <Link href={"/register"} legacyBehavior>
              <a>Register</a>
            </Link>
          </li>
        )}

        {user && (
          <>
            <li className={styles.write_link}>
              <div className={styles.write_poem}>
                <Link href="/write_poem" legacyBehavior>
                  <a>
                    <span>Write</span>
                    <FontAwesomeIcon icon={faAdd} style={{ fontSize: 14 }} />
                  </a>
                </Link>
              </div>
            </li>
            <li className="user" ref={userIconRef}>
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
          left: dialogPosition.left + "px",
          right: dialogPosition.right + "px",
        }}
        id="dialogWrapper"
        className={styles.dialogWrapper}
      >
        {visible && user && <UserPopup user={user} />}
      </div>
    </nav>
  );
}
