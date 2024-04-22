import "@/styles/globals.css";
import { ToastContainer } from 'react-toastify';
import Context from "../context/context"
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  return <>
  <Context>
    <Component {...pageProps} />
    <ToastContainer theme="dark" />
  </Context>
  </>
}
