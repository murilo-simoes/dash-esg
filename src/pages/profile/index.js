import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";
import styles from './Profile.module.css'

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
        return (
        <div>
          <h1>PROFILE</h1>
        </div>
        )
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