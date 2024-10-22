import styles from "../styles/Main.module.css"; // Importando estilos

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguageSelect: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguages, onLanguageSelect }) => {
  const languages = ["dotNet", "java", "js", "nodejs", "php"];

  return (
    <section className={styles.section}>
      <h2>Quais linguagens de programação contém em suas aplicações?</h2>
      <div className={styles.cardSection}>
        {languages.map((language) => (
          <div
            key={language}
            className={`${styles.card} ${selectedLanguages.includes(language) ? styles.selected : ''}`}
            onClick={() => onLanguageSelect(language)}
          >
            <img src={`/img/script-languages/${language}.png`} alt={language} className={styles.cardImage} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LanguageSelector;
