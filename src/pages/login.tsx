import { useState } from "react";
import styles from "../styles/Register.module.css";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // prevent NextAuth from redirecting on success
      });

      if (result?.error) {
        console.log(result.error);
      }

      router.push("/"); // redirect to home page
    } catch (error) {
      console.log(error);
      console.log((error as Error).message);
    }
  };

  return (
    <div className={styles.register}>
      <h2>Login Form</h2>
      {/* {loading && <Spinner loading={loading} />} */}
      <form onSubmit={handleSubmit}>
        {/* {error && <div>{error}</div>} */}
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
