import Head from "next/head";
import { Button, Alert, AlertIcon } from "@chakra-ui/react"; // Importando Alert e AlertIcon
import { useState, useEffect } from "react"; // Importando useState e useEffect
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Importando o realce de sintaxe
import solarizedlight from 'react-syntax-highlighter/dist/cjs/styles/prism/solarizedlight'; // Estilo de realce
import styles from "../styles/Pergunta.module.css"; // Atualizando a importação para o novo módulo CSS
import { signOut } from "firebase/auth"; // Importando signOut
import { auth } from './api/firebaseConfig';
import { useRouter } from 'next/router'; // Importando useRouter para redirecionamento
import Loader from '../components/Loader'; // Importando o componente Loader

export default function Dashboard() {
  const router = useRouter(); // Inicializando o roteador
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null); // Estado para pipeline selecionada
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]); // Estado para linguagens selecionadas
  const [userQuestion, setUserQuestion] = useState<string>(""); // Estado para a pergunta do usuário
  const [gptResponse, setGptResponse] = useState<string | null>(null); // Estado para a resposta do ChatGPT
  const [loading, setLoading] = useState<boolean>(false); // Estado para controle do loader
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null); // Estado para solução selecionada
  const [showWarning, setShowWarning] = useState<boolean>(false); // Estado para controle do aviso

  useEffect(() => {
    const user = auth.currentUser; // Obtendo o usuário atual

    if (!user) {
      // Se não houver usuário autenticado, redireciona para a página home
      router.push('/');
    } else {
      // Invalida o token após 15 minutos
      const timeout = setTimeout(() => {
        signOut(auth); // Desloga o usuário
        router.push('/'); // Redireciona para a página home
      }, 15 * 60 * 1000); // 15 minutos em milissegundos

      return () => clearTimeout(timeout); // Limpa o timeout ao desmontar o componente
    }
  }, [router]); // Executa o efeito ao montar o componente

  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga o usuário
      window.location.href = '/'; // Redireciona para a página inicial
    } catch (error) {
      alert("Erro ao sair: " + (error as Error).message); // Corrigido para tratar error como Error
    }
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

  const handleSolutionSelect = (solution: string) => {
    setSelectedSolution(solution); // Atualiza a solução selecionada
    if (solution === 'veracode') {
      setShowWarning(false); // Esconde o aviso
      setGptResponse(null); // Limpa a resposta do ChatGPT
    } else if (solution === 'sd-elements' || solution === 'senhasegura') {
      setShowWarning(true); // Mostra o aviso
      setGptResponse(null); // Limpa a resposta do ChatGPT
    }
  };

  useEffect(() => {
    if (selectedPipeline && selectedLanguages.length > 0) {
      const prompt = `Me responda de maneira organizada e cronologica, direto e sem agradecimentos ou comprimentos. Como fazer integração do Veracode utilizando a pipeline ${selectedPipeline} de uma aplicação que contenha linguagem ${selectedLanguages.join(', ')}? Me de exemplos de trechos de códigos em que o Veracode está integrado, seja um YAML, JenkinsFile e etc.`;
      handleQuestionSubmit(prompt); // Envia o prompt ao ChatGPT
    }
  }, [selectedPipeline, selectedLanguages]); // Executa quando a pipeline ou linguagens mudam

  const handleQuestionSubmit = async (prompt: string) => {
    if (!prompt) return;

    setLoading(true); // Inicia o loader

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
    } finally {
      setLoading(false); // Finaliza o loader
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
        <title>Dashboard</title>
        <meta name="description" content="Página do Dashboard" />
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
            <h2>Escolha uma de nossas soluções:</h2>
            <div className={styles.cardSection}>
              <div
                className={`${styles.card} ${selectedSolution === 'veracode' ? styles.selected : ''}`}
                onClick={() => handleSolutionSelect('veracode')}
              >
                <img src="/img/solutions/veracode.jpg" alt="Veracode" className={styles.cardImage} />
              </div>
              <div
                className={`${styles.card} ${selectedSolution === 'sd-elements' ? styles.selected : ''}`}
                onClick={() => handleSolutionSelect('sd-elements')}
              >
                <img src="/img/solutions/sd-elements.jpg" alt="SD Elements" className={styles.cardImage} />
              </div>
              <div
                className={`${styles.card} ${selectedSolution === 'senhasegura' ? styles.selected : ''}`}
                onClick={() => handleSolutionSelect('senhasegura')}
              >
                <img src="/img/solutions/senhasegura.png" alt="senhasegura" className={styles.cardImage} />
              </div>
            </div>
          </section>
          {selectedSolution === 'veracode' && ( // Renderiza o select de pipeline e linguagens se Veracode for selecionado
            <>
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
            </>
          )}
          {showWarning && ( // Renderiza o aviso se SD Elements ou senhasegura forem selecionados
            <section className={styles.section}>
              <Alert status="warning">
                <AlertIcon />
                Estamos desenvolvendo essa funcionalidade. Em breve, estará disponível!
              </Alert>
            </section>
          )}
          {loading ? ( // Exibe o loader enquanto carrega
            <Loader />
          ) : gptResponse && ( // Condição para exibir a seção de resposta
            <section className={`${styles.section} ${styles.gptResponse}`}>
              <h2>Resposta via Savanah AI:</h2>
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
