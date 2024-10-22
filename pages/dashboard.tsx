import Head from "next/head";
import { useState, useEffect } from "react";
import Loader from '../components/Loader'; // Importando o componente Loader
import Navbar from '../components/Navbar'; // Importando o componente Navbar
import SolutionSelector from '../components/SolutionSelector'; // Importando o componente SolutionSelector
import PipelineSelector from '../components/PipelineSelector'; // Importando o componente PipelineSelector
import LanguageSelector from '../components/LanguageSelector'; // Importando o componente LanguageSelector
import WarningAlert from '../components/WarningAlert'; // Importando o componente WarningAlert
import ResponseSection from '../components/ResponseSection'; // Importando o componente ResponseSection
import QuestionInput from '../components/QuestionInput'; // Importando o componente QuestionInput
import { signOut } from "firebase/auth"; // Importando signOut
import { auth } from './api/firebaseConfig';
import { useRouter } from 'next/router'; // Importando useRouter para redirecionamento
import styles from "../styles/Main.module.css"; // Importando estilos

export default function Dashboard() {
  const router = useRouter();
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [gptResponse, setGptResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      router.push('/');
    } else {
      const timeout = setTimeout(() => {
        signOut(auth);
        router.push('/');
      }, 15 * 60 * 1000);

      return () => clearTimeout(timeout);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      alert("Erro ao sair: " + (error as Error).message);
    }
  };

  const handlePipelineSelect = (pipeline: string) => {
    setSelectedPipeline(pipeline);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(language)) {
        return prev.filter((lang) => lang !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const handleSolutionSelect = (solution: string) => {
    setSelectedSolution(solution);
    if (solution === 'veracode') {
      setShowWarning(false);
      setGptResponse(null);
    } else if (solution === 'sd-elements' || solution === 'senhasegura') {
      setShowWarning(true); // Exibe o aviso imediatamente
      setGptResponse(null);
    }
  };

  useEffect(() => {
    if (selectedPipeline && selectedLanguages.length > 0) {
      const prompt = `Me responda de maneira organizada e cronologica, direto e sem agradecimentos ou comprimentos. Como fazer integração do Veracode utilizando a pipeline ${selectedPipeline} de uma aplicação que contenha linguagem ${selectedLanguages.join(', ')}? Me de exemplos de trechos de códigos em que o Veracode está integrado, seja um YAML, JenkinsFile e etc.`;
      handleQuestionSubmit(prompt);
    }
  }, [selectedPipeline, selectedLanguages]);

  const handleQuestionSubmit = async (prompt: string) => {
    if (!prompt) return;

    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGptResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Erro ao chamar a API:", error);
      setGptResponse("Desculpe, ocorreu um erro ao buscar a resposta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Página do Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar onLogout={handleLogout} />
      <div className={styles.container}>
        <div className={styles.sectionContainer}>
          <SolutionSelector selectedSolution={selectedSolution} onSolutionSelect={handleSolutionSelect} />
          {selectedSolution === 'veracode' && (
            <>
              <PipelineSelector selectedPipeline={selectedPipeline} onPipelineSelect={handlePipelineSelect} />
              <LanguageSelector selectedLanguages={selectedLanguages} onLanguageSelect={handleLanguageSelect} />
            </>
          )}
          <WarningAlert show={showWarning} />
          {loading ? (
            <Loader />
          ) : (
            <ResponseSection response={gptResponse} />
          )}
          <QuestionInput 
            question={userQuestion} 
            onQuestionChange={setUserQuestion} 
            onSubmit={() => handleQuestionSubmit(userQuestion)} 
          />
        </div>
      </div>
    </>
  );
}
