import { useRouter } from 'next/router';
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRequest = router.pathname.startsWith('/admin');

  return (
    <div className="app-root">
      {!isAdminRequest && <Navbar />}
      <main className="content">
        <Component {...pageProps} />
      </main>
      {!isAdminRequest && <Footer />}
    </div>
  );
}
