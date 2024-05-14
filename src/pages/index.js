
import Loading from "@/components/Loading/Loading";
import styles from './index.module.css';
import { useRouter } from "next/router";
import IncluirEmpresa from "@/components/IncluirEmpresa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/api/axios";
import { useToken } from "@/context/TokenContext";
import { jwtDecode } from 'jwt-decode' // import dependency



export default function Home() {

  const router = useRouter();
  const {user, setUser} = useToken()
  const [loading, setLoading] = useState(false)
  const notifyError = (text) => toast.error(text)
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
    try{
      setLoading(true)
      const getUser = async() => {

      const config = {
          headers: { 'Authorization': `Bearer ${token}` }
      };
      const decodeToken = jwtDecode(token)

        const res = await api.post(`/user/find/?id=${decodeToken?.id}`,null, config)
        setUser(res.data)
        
      }

      getUser()

    }catch(err){
      notifyError("Erro ao pegar as informações do usuário!")
    }finally{
      setLoading(false)
    }
  }
  },[token])

  
  const renderComponent = () => {
    if(hasJWT()){
      if(loading){
        return <Loading type="spin" color="#7AA174" width={"60px"} height={"60px"} />
      }else{
        if(user?.id_company !== null){
          
          return(
          <div>
            <h1>DASHBOARD</h1>
          </div>
          )
        }else if(user?.user_type !== 2){
          return <IncluirEmpresa texto="Crie seu relatório de diagnóstico ESG cadastrando a sua empresa!" temBotao={true}/>
        }else{
          return <IncluirEmpresa texto="Quando for atribuido a uma empresa, o dashboard aparecerá aqui!" temBotao={false}/>
        }
      }
    }else{
      router.push('/login')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {renderComponent()}
      </div>
    </div>
  );
}
