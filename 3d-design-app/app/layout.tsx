import { ReactNode } from "react";

import '../styles/index.css'
import '../styles/loadingEffect.css'
import { Nunito_Sans } from '@next/font/google'

const nunito = Nunito_Sans({
    subsets: ['latin'],
    weight: ['400']
})

export default function RootLayout({ children }: {
    children: ReactNode;
  }) {
    return (
        <html lang="en">
            <head>
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <title>Arcus Design</title>
            </head>

            <body className={nunito.className}>
                {children}
            </body>
        </html>
    );
  }