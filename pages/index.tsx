/* eslint-disable @next/next/link-passhref */
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>Welcome to my new Portfolio</main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <Link
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className="h-4 ml-2"
            width={400}
            height={400}
          />
        </Link>
      </footer>
    </div>
  );
}
