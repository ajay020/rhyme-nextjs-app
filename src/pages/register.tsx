import { FormEvent, useState, useContext } from "react";
import styles from "../styles/Register.module.css";
import Link from "next/link";
import Spinner from "@/components/Spinner";

function RegisterForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerUser = async (e: FormEvent) => {
    e.preventDefault();

    if (name && email && password) {
      const userData = { name, email, password };
      setLoading(true);
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_APP_URL + "/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );
        const data = await response.json();
      } catch (error) {
        setLoading(false);
        setError((error as Error).message);
        console.log((error as Error).message);
      }
    }
  };

  return (
    <div className={styles.register}>
      <h2>SignUp Form</h2>
      {loading && <Spinner loading={loading} />}
      <form onSubmit={registerUser}>
        {error && <div>{error}</div>}
        <div className={styles.form_group}>
          <input
            type="text"
            placeholder="Name"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <button type="submit">Register</button>
        </div>
      </form>
      <div className={styles.already_section}>
        <p>
          Already SignedUp? <Link href="/signup">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
