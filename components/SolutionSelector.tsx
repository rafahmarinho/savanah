import { useState } from "react"; // Importando useState
import styles from "../styles/Main.module.css"; // Importando estilos

interface SolutionSelectorProps {
  selectedSolution: string | null;
  onSolutionSelect: (solution: string) => void;
}

const SolutionSelector: React.FC<SolutionSelectorProps> = ({ selectedSolution, onSolutionSelect }) => {
  const solutions = [
    { name: "Veracode", image: "/img/solutions/veracode.jpg" },
    { name: "SD-Elements", image: "/img/solutions/sd-elements.jpg" },
    { name: "Senhasegura", image: "/img/solutions/senhasegura.png" },
  ];

  return (
    <section className={styles.section}>
      <h2>Escolha uma de nossas soluções:</h2>
      <div className={styles.cardSection}>
        {solutions.map((solution) => (
          <div
            key={solution.name}
            className={`${styles.card} ${selectedSolution === solution.name.toLowerCase() ? styles.selected : ''}`}
            onClick={() => onSolutionSelect(solution.name.toLowerCase())}
          >
            <img src={solution.image} alt={solution.name} className={styles.cardImage} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SolutionSelector;
