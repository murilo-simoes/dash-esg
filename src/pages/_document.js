import { Html, Head, Main, NextScript } from "next/document";

export default function Document({children}) {
  return (
    <Html lang="pt-br">
      <Head />
      <body>
        <NextScript />
        <Main />
        {children}
      </body>
    </Html>
  );
}
