import InfoUserContainer from '../InfoUserContainer';
import LoginRegisterForm from '../LoginRegisterForm';
import styles from './InfoUser.module.css'

const InfoUser = () => {
    return (  
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.wrapperTitle}>
                    <h1>Minhas informações</h1>
                </div>
                <div className={styles.wrapperInfo}>
                    <InfoUserContainer/>    
                </div>
            </div>
        </div>
    );
}
 
export default InfoUser;