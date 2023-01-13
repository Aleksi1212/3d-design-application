import { ReactNode } from "react";

import '../styles/index.css'
import '../styles/borderEffect.css'
import { Raleway } from '@next/font/google'

const raleway = Raleway({
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

            <body className={raleway.className}>
                {children}
            </body>
        </html>
    );
  }