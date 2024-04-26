import styles from './InfoCompany.module.css'

const InfoCompany = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.wrapperTitle}>
                    <h1>Informações da empresa</h1>
                </div>
                <div className={styles.wrapperInfo}>
                    <div className={styles.userInfo}>

                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default InfoCompany;