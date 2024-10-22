import Head from "next/head";
import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import styles from "../styles/Home.module.css"; // Corrigindo o caminho da importação
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importando apenas o necessário
import LoginModal from "../components/LoginModal"; // Importando o LoginModal
import RegisterModal from "../components/RegisterModal"; // Importando o RegisterModal
import Lion from "../components/Lion"; // Importando o componente Lion

// Configurações do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Estado para o modal de login
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // Estado para o modal de registro

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onLoginOpen = () => setIsLoginOpen(true); // Função para abrir o modal de login
  const onLoginClose = () => setIsLoginOpen(false); // Função para fechar o modal de login
  const onRegisterOpen = () => setIsRegisterOpen(true); // Função para abrir o modal de registro
  const onRegisterClose = () => setIsRegisterOpen(false); // Função para fechar o modal de registro

  return (
    <>
      <Head>
        <title>Bem-vindo à Savanah</title>
        <meta name="description" content="Bem-vindo à Savanah" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Bem-vindo à Savanah</h1>
        <Lion /> {/* Adicionando o componente Lion aqui */}
        <p className={styles.description}>
          Integrações ágeis de maneira inteligente.
        </p>
        <div className={styles.buttonContainer}>
          <Button onClick={onRegisterOpen} colorScheme="blue">
            Criar Conta
          </Button>
          <Button colorScheme="gray" onClick={onLoginOpen}>Login</Button>
        </div>

        <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
        <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      </div>
    </>
  );
}
