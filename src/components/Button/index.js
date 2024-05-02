import styles from './Button.module.css'

const Button = ({text, click, style}) => {
    return ( 
        <button style={style} className={styles.button} onClick={click}>{text}</button>
     );
}
 
export default Button;