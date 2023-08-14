import type { AppProps } from 'next/app'
import Head from 'next/head'
import * as React from 'react'

export default function App ({ Component, pageProps }: AppProps): React.JSX.Element {
  return (
    <>
      <Head>
        <title>Medieval Commerce</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
