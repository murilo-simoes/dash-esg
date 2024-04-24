import Image from "next/image";
import styles from './LoginRegisterContent.module.css'; // Importe o CSS usando CSS Modules
import imageLogin from '../../../public/login-image.png'
import imageRegister from '../../../public/register-image.png'
const LoginRegisterContent = ({tipoForm}) => {
    return ( 
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{tipoForm === 1 ? "Bem-vindo(a) de volta!" : "Seja parte da mudança!" }</h1>
            <p className={styles.desc}>{tipoForm === 1 ? "Continue fazendo a diferença com ESG" : "Cadastre-se e fortaleça seu compromisso com ESG"}</p>
            <div className={styles.imgWrapper}>
                <Image priority={true} className={styles.img} src={tipoForm === 1 ? imageLogin : imageRegister} alt={tipoForm === 1 ? "Tablet dashboard" : "Dashboard ESG"}/>
            </div>
        </div>
     );
}
 
export default LoginRegisterContent;