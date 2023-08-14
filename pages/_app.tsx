import type { AppProps } from 'next/app'
import Head from 'next/head'
import * as React from 'react'

import { attachLogger } from 'effector-logger'

export default function App ({ Component, pageProps }: AppProps): React.JSX.Element {
  React.useEffect(() => {
    const detachLogger = attachLogger()
    return detachLogger
  }, [])

  return (
    <>
      <Head>
        <title>Medieval Commerce</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
