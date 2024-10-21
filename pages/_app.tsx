import '../styles/globals.css';
import Footer from '../components/Footer';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react'; // Importando ChakraProvider

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  );
}

export default MyApp;
