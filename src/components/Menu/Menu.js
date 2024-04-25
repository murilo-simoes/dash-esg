import styles from './Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFileCirclePlus, faUser, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';


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
                <div className={styles.wrapper}>
                    <div className={styles.wrapperPages}>
                        <div onClick={() => router.push('/')} className={styles.pages}>
                            <FontAwesomeIcon icon={faChartLine} className={styles.iconPage}/>
                        </div>
                        <div onClick={() => router.push('/addCompany')} className={styles.pages}>
                            <FontAwesomeIcon icon={faFileCirclePlus} className={styles.iconPage}/>
                        </div>
                        <div onClick={() => router.push('/profile')} className={styles.pages}>
                            <FontAwesomeIcon icon={faUser} className={styles.iconPage}/>
                        </div>
                    </div>
                    <div onClick={handleLogout} className={styles.logout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className={styles.iconPageLogout}/>
                    </div>
                </div>
            </div>
     );
}
 
export default Menu;