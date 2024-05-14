import styles from './IncluirEmpresa.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router';

const IncluirEmpresa = ({texto, temBotao}) => {
    const router = useRouter()
    
    return ( 
        <>
            <div className={styles.titleWrapper}>
                <h1 className={styles.title}>{texto}</h1>
            </div>
            <div style={{display: temBotao === true ? "flex" : "none"}} hidden={temBotao === true ? false : true} onClick={() => router.push('/addCompany')} className={styles.buttonWrapper}>
                <FontAwesomeIcon className={styles.iconButton} icon={faPlus} />
            </div>
         </>
     );
}
 
export default IncluirEmpresa;