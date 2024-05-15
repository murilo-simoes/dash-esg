
import Loading from "@/components/Loading/Loading";
import styles from './index.module.css';
import { useRouter } from "next/router";
import IncluirEmpresa from "@/components/IncluirEmpresa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/api/axios";
import { useToken } from "@/context/TokenContext";
import { jwtDecode } from 'jwt-decode' // import dependency
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {

  const router = useRouter();
  const {user, setUser, company, setCompany, survey, setSurvey} = useToken()
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
      const getUser = async() => {
        setLoading(true)

      const config = {
          headers: { 'Authorization': `Bearer ${token}` }
      };
      const decodeToken = jwtDecode(token)

      const res = await api.post(`/user/find/?id=${decodeToken?.id}`,null, config)
      setUser(res.data)
      
      if(res.data.id_company != null){
        const sur = await api.post(`/survey/find?id_company=${res.data.id_company}` ,null,{
          headers:{
              Authorization: `Bearer ${token}`
          }
        });

        setSurvey(sur.data)
      }

      }

      getUser()

    }catch(err){
      console.log(err)
      notifyError("Erro ao pegar as informações do usuário!")
    }finally{
      setLoading(false)
    }
  }
  },[token])

  const data = {
    labels: ['Ambiental', 'Social', 'Governamental'],
    datasets: [
      {
        label: 'ESG',
        data: [survey?.ambiental, survey?.social, survey?.governamental],
        label:'%',
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const renderComponent = () => {
    if(hasJWT()){
      if(loading){
        return <Loading type="spin" color="#7AA174" width={"60px"} height={"60px"} />
      }else{
        if(user?.id_company !== null){
          
          return(
          <div>
            {loading ? 
            <Loading type="spin" color="#7AA174" width={"60px"} height={"60px"} />
            :
            <Pie data={data} />}
          </div>
          )
        }else if(user?.user_type !== 2){
          return (
            <div style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                <IncluirEmpresa texto="Crie seu relatório de diagnóstico ESG cadastrando a sua empresa!" temBotao={true}/>
            </div>
           )
        }else{
          return (
            <div style={{width:"100%",  display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                <IncluirEmpresa texto="Quando for atribuido a uma empresa, o dashboard aparecerá aqui!" temBotao={false}/>
            </div>
           )
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
