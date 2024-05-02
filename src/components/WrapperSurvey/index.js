import styles from './WrapperSurvey.module.css'

const WrapperSurvey = ({children}) => {
    return ( 
        <>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    {children}
                </div>
            </div>
        </>
     );
}
 
export default WrapperSurvey;