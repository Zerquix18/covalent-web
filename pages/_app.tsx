import '../styles/globals.css';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
