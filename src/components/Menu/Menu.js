import styles from './Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFileCirclePlus, faUser, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import logo5 from '../../../public/logo5.png'
import Image from 'next/image';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'


const Menu = ({}) => {
    let user;
    const router = useRouter()
    const notifySuccess = (text) => toast.success(text);

    if (typeof window !== "undefined") {
      user = JSON.parse(localStorage.getItem("user")) || undefined
    }

    const handleLogout = () => {
        console.log("ClICOU")
        localStorage.removeItem("user")
        notifySuccess("Sessão finalizada!")
        router.push('/login')

    }

    return ( 
            <div className={styles.container}>
                <Tooltip id="tooltipMenu" variant="success" />
                <Tooltip id="tooltipMenuLogout" variant="error" />
                <div className={styles.wrapper}>
                    <div className={styles.wrapperPages}>
                        <div className={styles.logoDiv}>
                            <Image className={styles.logoImage} src={logo5} alt={"Logo do ESG Focus"}/>
                        </div>
                        <div data-tooltip-id="tooltipMenu" data-tooltip-content="Dashboard" onClick={() => router.push('/')} className={styles.pages}>
                            <FontAwesomeIcon icon={faChartLine} className={styles.iconPage}/>
                        </div>
                        <div data-tooltip-id="tooltipMenu" data-tooltip-content="Criar relatório" onClick={() => router.push('/addCompany')} className={styles.pages}>
                            <FontAwesomeIcon icon={faFileCirclePlus} className={styles.iconPage}/>
                        </div>
                        <div data-tooltip-id="tooltipMenu" data-tooltip-content="Meu perfil" onClick={() => router.push('/profile')} className={styles.pages}>
                            <FontAwesomeIcon icon={faUser} className={styles.iconPage}/>
                        </div>
                    </div>
                    <div data-tooltip-id="tooltipMenuLogout" data-tooltip-content="Deslogar" onClick={handleLogout} className={styles.logout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className={styles.iconPageLogout}/>
                    </div>
                </div>
            </div>
     );
}
 
export default Menu;