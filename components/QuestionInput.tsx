import { Button } from "@chakra-ui/react"; // Importando Button
import styles from "../styles/Main.module.css"; // Importando estilos

interface QuestionInputProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, onQuestionChange, onSubmit }) => {
  return (
    <section className={styles.section}>
      <h2>Tire suas dúvidas</h2>
      <input 
        type="text" 
        placeholder="Digite sua pergunta aqui..." 
        className={styles.input} 
        value={question} 
        onChange={(e) => onQuestionChange(e.target.value)} 
      />
      <Button colorScheme="blue" onClick={onSubmit}>
        Enviar
      </Button>
    </section>
  );
};

export default QuestionInput;
