import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Importando o realce de sintaxe
import solarizedlight from 'react-syntax-highlighter/dist/cjs/styles/prism/solarizedlight'; // Estilo de realce
import styles from "../styles/Main.module.css"; // Importando estilos

interface ResponseSectionProps {
  response: string | null;
}

const ResponseSection: React.FC<ResponseSectionProps> = ({ response }) => {
  if (!response) return null; // Não renderiza nada se não houver resposta

  const formatResponse = (response: string) => {
    return response.split('\n').map((line, index) => {
      if (line.startsWith('```')) {
        const language = line.replace('```', '').trim(); // Obtém a linguagem
        return (
          <SyntaxHighlighter key={index} language={language} style={solarizedlight}>
            {line}
          </SyntaxHighlighter>
        );
      }
      return <p key={index}>{line}</p>; // Retorna um parágrafo normal
    });
  };

  return (
    <section className={`${styles.section} ${styles.gptResponse}`}>
      <h2>Resposta via Savanah AI:</h2>
      {formatResponse(response)} {/* Formata a resposta */}
    </section>
  );
};

export default ResponseSection;
