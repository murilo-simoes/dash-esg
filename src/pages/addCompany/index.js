import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";
import styles from './AddCompany.module.css'

const AddCompany = () => {
    const router = useRouter();
    let user;
    if (typeof window !== "undefined") {
      user = JSON.parse(localStorage.getItem("user")) || undefined
      
      if(!user){
        router.push('/login')
      }
    }
    return ( 
        <div>
        { user ?
        <div className={styles.container} >
            <h1>ADD COMPANY</h1>
        </div>
          : 
          <div className={styles.loadingContainer}> 
            <Loading 
            type="spin" 
            color="#7AA174"
            width={"5%"}
            height={"5%"}
            />
          </div>
          }
        </div>
     );
}
 
export default AddCompany;