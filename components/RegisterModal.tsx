import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
} from "@chakra-ui/react"; // Importando componentes do Chakra UI

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para a mensagem de erro
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard'); // Redireciona para o dashboard após o registro
    } catch (error: any) {
      console.error("Erro ao registrar:", error); // Log detalhado do erro
      const errorMessage = error.message.includes("auth/email-already-in-use")
        ? "Este e-mail já está em uso. Por favor, tente outro."
        : error.message;
      setErrorMessage(errorMessage); // Define a mensagem de erro
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar Conta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {errorMessage && ( // Exibe o alerta se houver uma mensagem de erro
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertTitle>Erro!</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
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
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleRegister}>
            Criar Conta
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
