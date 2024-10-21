import Head from "next/head";
import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react"; // Importando useState e useEffect
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Importando o realce de sintaxe
import solarizedlight from 'react-syntax-highlighter/dist/cjs/styles/prism/solarizedlight'; // Estilo de realce
import styles from "../styles/Pergunta.module.css"; // Atualizando a importação para o novo módulo CSS

export default function Pergunta() {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null); // Estado para pipeline selecionada
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]); // Estado para linguagens selecionadas
  const [userQuestion, setUserQuestion] = useState<string>(""); // Estado para a pergunta do usuário
  const [gptResponse, setGptResponse] = useState<string | null>(null); // Estado para a resposta do ChatGPT

  const handleLogout = () => {
    alert("Você saiu!");
  };

  const handlePipelineSelect = (pipeline: string) => {
    setSelectedPipeline(pipeline); // Atualiza a pipeline selecionada
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(language)) {
        return prev.filter((lang) => lang !== language); // Remove se já estiver selecionada
      } else {
        return [...prev, language]; // Adiciona a nova linguagem
      }
    });
  };

  useEffect(() => {
    if (selectedPipeline && selectedLanguages.length > 0) {
      const prompt = `Me responda de maneira organizada e cronologica, direto e sem agradecimentos ou comprimentos. Como fazer integração do Veracode utilizando a pipeline ${selectedPipeline} de uma aplicação que contenha linguagem ${selectedLanguages.join(', ')}? Me de exemplos de trechos de códigos em que o Veracode está integrado, seja um YAML, JenkinsFile e etc.`;
      handleQuestionSubmit(prompt); // Envia o prompt ao ChatGPT
    }
  }, [selectedPipeline, selectedLanguages]); // Executa quando a pipeline ou linguagens mudam

  const handleQuestionSubmit = async (prompt: string) => {
    if (!prompt) return;

    console.log("Chave da API:", process.env.NEXT_PUBLIC_OPENAI_API_KEY); // Verifica se a chave da API está sendo lida

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // Usando a nova variável de ambiente
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Lança um erro se a resposta não for ok
      }

      const data = await response.json();
      setGptResponse(data.choices[0].message.content); // Armazena a resposta do ChatGPT
    } catch (error) {
      console.error("Erro ao chamar a API:", error);
      setGptResponse("Desculpe, ocorreu um erro ao buscar a resposta.");
    }
  };

  const formatResponse = (response: string) => {
    // Divide a resposta em parágrafos e realça a sintaxe
    return response.split('\n').map((line, index) => {
      // Verifica se a linha contém código (exemplo: começa com "```")
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
    <>
      <Head>
        <title>Pergunta</title>
        <meta name="description" content="Página para fazer uma pergunta" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <h2>Olá, humano!</h2>
        </div>
        <div className={styles.navbarRight}>
          <Button colorScheme="red" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </nav>
      <div className={styles.container}>
        <div className={styles.sectionContainer}> {/* Novo container para as seções */}
          <section className={styles.section}>
            <h2>Qual é a sua pipeline?</h2>
            <div className={styles.cardSection}>
              <div
                className={`${styles.card} ${selectedPipeline === 'azure-devops' ? styles.selected : ''}`}
                onClick={() => handlePipelineSelect('azure-devops')}
              >
                <img src="/img/pipeline/azure-devops.jpg" alt="Azure DevOps" className={styles.cardImage} />
              </div>
              <div
                className={`${styles.card} ${selectedPipeline === 'gitlab-cicd' ? styles.selected : ''}`}
                onClick={() => handlePipelineSelect('gitlab-cicd')}
              >
                <img src="/img/pipeline/gitlab-cicd.png" alt="GitLab CI/CD" className={styles.cardImage} />
              </div>
              <div
                className={`${styles.card} ${selectedPipeline === 'jenkins' ? styles.selected : ''}`}
                onClick={() => handlePipelineSelect('jenkins')}
              >
                <img src="/img/pipeline/jenkins.jpg" alt="Jenkins" className={styles.cardImage} />
              </div>
              <div
                className={`${styles.card} ${selectedPipeline === 'github-actions' ? styles.selected : ''}`}
                onClick={() => handlePipelineSelect('github-actions')}
              >
                <img src="/img/pipeline/github-actions.png" alt="GitHub Actions" className={styles.cardImage} />
              </div>
            </div>
          </section>
          <section className={styles.section}>
            <h2>Quais linguagens de programação contém em suas aplicações?</h2>
            <div className={styles.cardSection}>
              {["dotNet", "java", "js", "nodejs", "php"].map((language) => (
                <div
                  key={language}
                  className={`${styles.card} ${selectedLanguages.includes(language) ? styles.selected : ''}`} // Adiciona classe se selecionado
                  onClick={() => handleLanguageSelect(language)}
                >
                  <img src={`/img/script-languages/${language}.png`} alt={language} className={styles.cardImage} />
                </div>
              ))}
            </div>
          </section>
          {gptResponse && ( // Condição para exibir a seção de resposta
            <section className={`${styles.section} ${styles.gptResponse}`}>
              <h2>Resposta do ChatGPT:</h2>
              {formatResponse(gptResponse)} {/* Formata a resposta */}
            </section>
          )}
          <section className={styles.section}>
            <h2>Tire suas dúvidas</h2>
            <input 
              type="text" 
              placeholder="Digite sua pergunta aqui..." 
              className={styles.input} 
              value={userQuestion} 
              onChange={(e) => setUserQuestion(e.target.value)} 
            />
            <Button colorScheme="blue" onClick={() => handleQuestionSubmit(userQuestion)}>
              Enviar
            </Button>
          </section>
        </div> {/* Fim do novo container */}
      </div>
    </>
  );
}
