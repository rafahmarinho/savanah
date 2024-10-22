import styles from "../styles/Main.module.css"; // Importando estilos

interface PipelineSelectorProps {
  selectedPipeline: string | null;
  onPipelineSelect: (pipeline: string) => void;
}

const PipelineSelector: React.FC<PipelineSelectorProps> = ({ selectedPipeline, onPipelineSelect }) => {
  const pipelines = [
    { name: "Azure DevOps", image: "/img/pipeline/azure-devops.jpg" },
    { name: "GitLab CI/CD", image: "/img/pipeline/gitlab-cicd.png" },
    { name: "Jenkins", image: "/img/pipeline/jenkins.jpg" },
    { name: "GitHub Actions", image: "/img/pipeline/github-actions.png" },
  ];

  return (
    <section className={styles.section}>
      <h2>Qual é a sua pipeline?</h2>
      <div className={styles.cardSection}>
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.name}
            className={`${styles.card} ${selectedPipeline === pipeline.name.toLowerCase() ? styles.selected : ''}`}
            onClick={() => onPipelineSelect(pipeline.name.toLowerCase())}
          >
            <img src={pipeline.image} alt={pipeline.name} className={styles.cardImage} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PipelineSelector;
