import { Html, Head, Main, NextScript } from 'next/document'
import * as React from 'react'

export default function Document (): React.JSX.Element {
  return (
    <Html lang='en'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <link rel='stylesheet' href='/app.css' />
        <link rel='stylesheet' href='/tachyons.min.css' />
      </Head>
      <body className='georgia f4'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
