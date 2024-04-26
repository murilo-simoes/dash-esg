import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";
import styles from './Profile.module.css'
import InfoUser from "@/components/InfoUser";
import InfoCompany from "@/components/InfoCompany";
import Separador from "@/components/Separador";

const Profile = () => {

    const router = useRouter();
    let user;
    if (typeof window !== "undefined") {
      user = JSON.parse(localStorage.getItem("user")) || undefined
      
      if(!user){
        router.push('/login')
      }
    }

    const renderComponent = () => {
      if(user){
        if(user.id_company !== null){
          return (
            <div className={styles.container}>
              <div className={styles.wrapper}>
                <InfoUser/>
              </div>
              <div className={styles.separador}>
                <Separador/>
              </div>
              <div className={styles.wrapper}>
                <InfoCompany/>
              </div>
            </div>
            )
        }else{
          return(
            <div className={styles.container}>
              <div className={styles.wrapper}>
                <InfoUser/>
              </div>
            </div>
          )
        }
      }else{
        return(
          <div className={styles.loadingContainer}> 
          <Loading 
          type="spin" 
          color="#7AA174"
          width={"5%"}
          height={"5%"}
          />
          </div>  
        )
      }
    }

    return ( 
        <>
          {renderComponent()}
        </>
     );
}
 
export default Profile;