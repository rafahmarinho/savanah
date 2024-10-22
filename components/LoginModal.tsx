import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../pages/api/firebaseConfig';
import {
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
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner, // Importando o Spinner do Chakra UI
} from "@chakra-ui/react"; // Importando componentes do Chakra UI

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para a mensagem de erro
  const [showPopup, setShowPopup] = useState<boolean>(false); // Estado para o pop-up
  const [loading, setLoading] = useState<boolean>(false); // Estado para o loader
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true); // Ativa o loader
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard'); // Alterado para redirecionar para /dashboard
    } catch (error: any) {
      setErrorMessage("Credenciais inválidas. Tente novamente."); // Mensagem de erro genérica
      setShowPopup(true); // Exibe o pop-up
      setTimeout(() => {
        setShowPopup(false); // Oculta o pop-up após 5 segundos
      }, 5000);
    } finally {
      setLoading(false); // Desativa o loader após a tentativa de login
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {showPopup && ( // Exibe o pop-up se showPopup for verdadeiro
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertTitle>Erro!</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {loading ? ( // Exibe o loader se loading for verdadeiro
            <Spinner size="lg" />
          ) : (
            <>
              <FormControl>
                <FormLabel>Email:</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Senha:</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleLogin} isLoading={loading}>
            Entrar
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
