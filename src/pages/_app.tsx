import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import "weather-icons/css/weather-icons.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
