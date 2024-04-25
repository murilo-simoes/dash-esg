import styles from './IncluirEmpresa.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router';

const IncluirEmpresa = () => {
    const router = useRouter()
    
    return ( 
        <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>Crie seu relatório de diagnóstico ESG cadastrando a sua empresa!</h1>
            </div>
            <div onClick={() => router.push('/addCompany')} className={styles.buttonWrapper}>
                <FontAwesomeIcon className={styles.iconButton} icon={faPlus} />
            </div>
         </div>
     );
}
 
export default IncluirEmpresa;