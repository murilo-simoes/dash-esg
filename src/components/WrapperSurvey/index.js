import styles from './WrapperSurvey.module.css'

const WrapperSurvey = ({estilo, children}) => {
    return ( 
        <>
            <div className={styles.container}>
                <div style={estilo} className={styles.wrapper}>
                    {children}
                </div>
            </div>
        </>
     );
}
 
export default WrapperSurvey;