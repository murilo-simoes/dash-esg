
import Loading from "@/components/Loading/Loading";
import styles from './index.module.css';
import { useRouter } from "next/router";
import IncluirEmpresa from "@/components/IncluirEmpresa";



export default function Home() {
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
        
        return(
        <div>
          <h1>DASHBOARD</h1>
        </div>
        )
      }else if(user.user_type !== 2){
        return <IncluirEmpresa texto="Crie seu relatório de diagnóstico ESG cadastrando a sua empresa!" temBotao={true}/>
      }else{
        return <IncluirEmpresa texto="Quando for atribuido a uma empresa, o dashboard aparecerá aqui!" temBotao={false}/>
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
