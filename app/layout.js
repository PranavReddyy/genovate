import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';

// Initialize the Roboto font
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

// Initialize the Roboto Mono font
const robotoMono = Roboto_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: 'Genovate - Gene Information Explorer',
  description: 'Search for any human gene or protein to discover insights across multiple biological domains',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}