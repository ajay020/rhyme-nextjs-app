import styles from "../styles/UserPopup.module.css";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

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
        <li>
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </li>
        <li className={styles.logout_btn}>
          <p onClick={() => logout()}>Logout</p>
        </li>
      </ul>
    </div>
  );
}

export default UserPopup;
