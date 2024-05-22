import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";
import styles from './Profile.module.css'
import InfoUser from "@/components/InfoUser";
import InfoCompany from "@/components/InfoCompany";
import Separador from "@/components/Separador";
import { api } from "@/api/axios";
import { useToken } from "@/context/TokenContext";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { isTokenExpired } from "@/functions/isTokenExpired";

const Profile = () => {

    const router = useRouter();
    const {user, setUser} = useToken();
    const notifyWarning = (text) => toast.warn(text)
    let token;

    function hasJWT() {
      let flag = false;
  
      //check user has JWT token
      token = localStorage.getItem('token')
  
      if(token !== undefined && token !== null){
        flag=true
      }else{
        flag=false
      }
  
      return flag
    }

    useEffect(() => {
      if(hasJWT()){
      const getUser = async() => {
  
        if(isTokenExpired(token)){
          localStorage.removeItem('token')
          notifyWarning("Sessão expirada! Realize o login novamente!")
          router.push('/login')
          return
        }

      const config = {
          headers: { 'Authorization': `Bearer ${token}` }
      };
      const decodeToken = jwtDecode(token)
  
        const res = await api.post(`/user/find/?id=${decodeToken?.id}`,null, config)
        setUser(res.data)
        
      }
  
      getUser()
    }
    },[token])

    const renderComponent = () => {
      if(hasJWT()){
      if(user){
        if(user?.id_company !== null){
          return (
            <div className={styles.container}>
              <div className={styles.wrapperAll}>
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
            </div>
            )
        }else{
          return(
            <div className={styles.containerSolo}>
              <div className={styles.wrapperSolo}>
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
          width={"60px"}
          height={"60px"}
          />
          </div>  
        )
      }
    }else{
      router.push('/login')
    }
  }

    return ( 
        <>
          {renderComponent()}
        </>
     );
}
 
export default Profile;