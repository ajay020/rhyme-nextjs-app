import "@/styles/globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Layout from "@/components/Layout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { AppProps } from "next/app";

import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </SessionProvider>
  );
}
