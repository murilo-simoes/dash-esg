import InfoCompanyContainer from '../InfoCompanyContainer';
import InfoUserContainer from '../InfoUserContainer';
import styles from './InfoCompany.module.css'

const InfoCompany = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.wrapperTitle}>
                    <h1>Informações da empresa</h1>
                </div>
                <div className={styles.wrapperInfo}>
                    <InfoCompanyContainer/>    
                </div>
            </div>
        </div>
    );
}
 
export default InfoCompany;