import '../styles/globals.css';
import Footer from '../components/Footer';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react'; // Importando ChakraProvider
import { useEffect, useState } from 'react'; // Importando useEffect e useState
import Loader from '../components/Loader'; // Importando o componente Loader

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(true); // Começa com loading como true

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Define loading como false após 3 segundos
    }, 3000); // 3 segundos

    return () => clearTimeout(timer); // Limpa o timer ao desmontar
  }, []);

  return (
    <ChakraProvider>
      {loading ? <Loader /> : <Component {...pageProps} />} {/* Exibe o loader durante o carregamento */}
      <Footer />
    </ChakraProvider>
  );
}

export default MyApp;
