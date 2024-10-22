import { Button } from "@chakra-ui/react"; // Importando Button
import styles from "../styles/Main.module.css"; // Importando estilos

interface NavbarProps {
  onLogout: () => void; // Definindo o tipo para onLogout
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <h2>Olá, humano!</h2>
      </div>
      <div className={styles.navbarRight}>
        <Button colorScheme="red" onClick={onLogout}>
          Sair
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
