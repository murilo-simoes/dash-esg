import Menu from "@/components/Menu/Menu";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {TokenProvider, useToken} from '../context/TokenContext'
import Router from "next/router";

import '../styles/tabulator_bootstrap5.min.css';

export default function App({ Component, pageProps, ...appProps }) {

  const [loaded, setLoaded] = useState(false)
  
  const getContent = () => {
      if ([`/login`, `/register`].includes(appProps.router.pathname)){
          return loaded && (
              <>
                <Component {...pageProps} />
                <ToastContainer theme="dark" />
              </>
          )
      }

      return loaded && (
            <div style={{display:"flex"}}>
              <Menu/>
              <Component {...pageProps} />
              <ToastContainer theme="dark" />
            </div>
          )
        
}
useEffect(() => {
  setLoaded(true)
}, [])

  return (
        <TokenProvider>
          {getContent()}
        </TokenProvider>
      )


}
