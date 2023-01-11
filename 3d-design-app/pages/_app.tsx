import '../styles/index.css'
import '../styles/borderEffect.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Raleway } from '@next/font/google'

const raleway = Raleway({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='widht=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <title>Arcus Design</title>
      </Head>

      <main className={raleway.className}>
        <Component {...pageProps} />
      </main>
    </>
  )
}