import styles from "../styles/Navbar.module.css";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export function Navbar() {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className={styles.navbar}>
      <p className={styles.brand_title}>Rhyme</p>

     { user && <p className={styles.user_name}> Hi, {user?.name}</p>}

      {user ? (
        <p className={styles.login_btn}>
          <a onClick={() => logout()}>Logout</a>
        </p>
      ) : (
        <>
          {" "}
          <p className={styles.register_btn}>
            <a href="/register">Register</a>
          </p>
          <p className={styles.login_btn}>
            <a href="/login">Login</a>
          </p>
        </>
      )}
    </div>
  );
}
