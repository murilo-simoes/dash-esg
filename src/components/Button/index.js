import styles from './Button.module.css'

const Button = ({text, click, style, disable, children}) => {
    return ( 
        <button disabled={disable} style={style} className={styles.button} onClick={click}>{children}{text}</button>
     );
}
 
export default Button;