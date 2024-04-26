import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";
import styles from './AddCompany.module.css'
import IncluirEmpresa from "@/components/IncluirEmpresa";

const AddCompany = () => {
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
        if(user.user_type !== 2 ){

          return (
            <div className={styles.container} >
            <h1>ADD COMPANY</h1>
          </div>
        )
      }else{
        return (
          <IncluirEmpresa texto="Você não tem autorização para incluir uma empresa!" temBotao={false}/>
        )
      }
      }else{
        return (
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
 
export default AddCompany;