import styles from "../styles/UserPopup.module.css";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

type User = {
  name: string;
  email: string;
  token: string;
};

interface Props {
  user: User | null;
}

function UserPopup({ user }: Props) {
  const { logout } = useContext(AuthContext);

  return (
    <div className={styles.user_popup}>
      <ul>
        <li className={styles.user_info}>
          <FontAwesomeIcon icon={faUser} />
          <div>
            <p>{user?.name}</p>
            <p>{user?.email}</p>
          </div>
        </li>
        <hr />
        <li className={styles.logout_btn}>
          <p onClick={() => logout()}>
            <FontAwesomeIcon icon={faSignOut} style={{ fontSize: 16 }} />
            <span> Logout</span>
          </p>
        </li>
      </ul>
    </div>
  );
}

export default UserPopup;
