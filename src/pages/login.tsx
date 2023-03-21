import { useState, FormEvent, useContext } from "react";
import styles from "../styles/Register.module.css";
import { AuthContext } from "../components/AuthProvider";
import Link from "next/link";
import Spinner from "@/components/Spinner";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, loading, error } = useContext(AuthContext);

  const loginUser = async (e: FormEvent) => {
    e.preventDefault();

    if (email && password) {
      login(email, password);
    }
  };

  return (
    <div className={styles.register}>
      <h2>Login Form</h2>
      {loading && <Spinner loading={loading} />}
      <form onSubmit={loginUser}>
        {error && <div>{error}</div>}
        <div className={styles.form_group}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <button type="submit">Login</button>
        </div>
      </form>
      <div className={styles.already_section}>
        <p>
          Not a member? <Link href="/register">SignUp</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
