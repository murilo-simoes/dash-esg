
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

  return (
    <>
    { user ?
    (user.id_company !== null ?
    <div>
      <h1>DASHBOARD</h1>
    </div>
    :
    <div className={styles.containerIncluir}>
        <IncluirEmpresa/>
    </div>
    )
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
    </>
  );
}
