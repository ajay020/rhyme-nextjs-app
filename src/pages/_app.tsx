import "@/styles/globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Layout from "@/components/Layout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
