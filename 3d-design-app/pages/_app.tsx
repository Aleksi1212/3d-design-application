import '../styles/index.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='widht=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <title>Arcus Design</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}