import { useSession, signOut } from "next-auth/react";
import styles from "../styles/UserPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

function UserPopup() {
  const { data: session } = useSession();

  return (
    <div className={styles.user_popup}>
      <ul>
        <li className={styles.user_info}>
          <FontAwesomeIcon icon={faUser} />
          <div>
            <p>{session?.user?.name}</p>
            <p>{session?.user?.email}</p>
          </div>
        </li>
        <hr style={{ color: "gray", width: "100%" }} />
        <li className={styles.logout_btn}>
          <p onClick={() => signOut()}>
            <FontAwesomeIcon icon={faSignOut} style={{ fontSize: 16 }} />
            <span> Logout</span>
          </p>
        </li>
      </ul>
    </div>
  );
}

export default UserPopup;
