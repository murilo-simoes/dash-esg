import styles from './Wrapper.module.css'; // Importe o CSS usando CSS Modules


const Wrapper = ({children}) => {
    return ( 
        <main className={styles.wrapper}>
            {children}
        </main>
     );
}
 
export default Wrapper;