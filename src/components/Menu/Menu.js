import styles from './Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFileCirclePlus, faAddressCard, faArrowRightFromBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import logo6 from '../../../public/logo6.png'
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
                            <Image className={styles.logoImage} src={logo6} alt={"Logo do ESG Focus"}/>
                        </div>
                        <div data-tooltip-id="tooltipMenu" data-tooltip-content="Dashboard" onClick={() => router.push('/')} className={styles.pages}>
                            <FontAwesomeIcon icon={faChartLine} className={styles.iconPage}/>
                        </div>
                        <div style={{display: user?.user_type !== 2 ? "flex" : "none"}} data-tooltip-id="tooltipMenu" data-tooltip-content="Criar relatório" onClick={() => router.push('/addCompany')} className={styles.pages}>
                            <FontAwesomeIcon icon={faFileCirclePlus} className={styles.iconPage}/>
                        </div>
                        <div style={{display: user?.user_type !== 2 && user?.id_company !== null ? "flex" : "none"}} data-tooltip-id="tooltipMenu" data-tooltip-content="Adicionar funcionários" onClick={() => router.push('/addEmployee')} className={styles.pages}>
                            <FontAwesomeIcon icon={faUserPlus} className={styles.iconPage}/>
                        </div>
                        <div data-tooltip-id="tooltipMenu" data-tooltip-content="Meu perfil" onClick={() => router.push('/profile')} className={styles.pages}>
                            <FontAwesomeIcon icon={faAddressCard} className={styles.iconPage}/>
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