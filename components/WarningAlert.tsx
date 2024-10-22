import { Alert, AlertIcon } from "@chakra-ui/react"; // Importando Alert e AlertIcon
import styles from "../styles/Main.module.css"; // Importando estilos

interface WarningAlertProps {
  show: boolean;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ show }) => {
  if (!show) return null; // Não renderiza nada se não houver aviso

  return (
    <section className={styles.sectionWarning}>
      <Alert status="warning">
        <AlertIcon />
        Estamos desenvolvendo essa funcionalidade. Em breve, estará disponível!
      </Alert>
    </section>
  );
};

export default WarningAlert;
