
import Loading from "@/components/Loading/Loading";
import styles from './index.module.css';
import { useRouter } from "next/router";
import IncluirEmpresa from "@/components/IncluirEmpresa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/api/axios";
import { useToken } from "@/context/TokenContext";
import { jwtDecode } from 'jwt-decode' // import dependency
import { Chart as ChartJS,
                  ArcElement, 
                  Tooltip, 
                  Legend, 
                  Title,
                  CategoryScale,
                  LinearScale,
                  BarElement, } from "chart.js";
import { Pie, Bar} from "react-chartjs-2";

import { ReactTabulator } from 'react-tabulator'



ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement);

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

        const com = await api.post(`/company/find?id=${res.data.id_company}`, null, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        })

        setCompany(com.data)


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



  const calcPorcentagemEsgCompany = (i) => {
    const total = survey?.ambiental + survey?.social + survey?.governamental;
    let ambiental = ((survey?.ambiental / total) * 100).toFixed(1)
    let social = ((survey?.social / total) * 100).toFixed(1)
    let governamental = ((survey?.governamental / total) * 100).toFixed(1)

    if(i === 1){
      return ambiental
    }else if(i === 2){
      return social
    }else{
      return governamental
    }
  }

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        display:true,
        position: "top",  
        labels:{
          font:{
            size:15
          }
        }  
      },
      title: {
        display: true,
        text: 'Visões da empresa',
        font: {
          size: 20,
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  
  const labels = ['Estratégico', 'Planejamento', 'Controle', 'Ação'];
  const arrayAmbiental = [survey?.ambiental_estrategico, survey?.ambiental_planejamento, survey?.ambiental_controle, survey?.ambiental_acao]
  const arraySocial = [survey?.social_estrategico, survey?.social_planejamento, survey?.social_controle, survey?.social_acao]
  const arrayGovernamental = [survey?.governamental_estrategico, survey?.governamental_planejamento, survey?.governamental_controle, survey?.governamental_acao]

  const dataBar = {
    labels,

    datasets: [
      {
        
        label: 'Ambiental %',
        data: arrayAmbiental.map(item => item),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Social %',
        data: arraySocial.map(item => item),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      },
      {
        label: 'Governamental %',
        data: arrayGovernamental.map(item => item),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
    ],
  };

  const optionsBar2 = {
    responsive: true,
    plugins: {
      legend: {
        display:true,
        position: "top",  
        labels:{
          font:{
            size:15
          }
        }  
      },
      title: {
        display: true,
        text: 'Média ESG',
        font: {
          size: 20,
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  

  const labls2 = ['Ambiental', 'Social', 'Governamental', 'Total Geral'];
  const arrayDataBar2 = [survey?.ambiental, survey?.social, survey?.governamental, survey?.total_geral]
  const dataBar2 = {
    labels: ['Ambiental', 'Social', 'Governamental', 'Média ESG'],
    datasets: [
      {
        label: 'Média %',
        data: arrayDataBar2.map(item => item),
        backgroundColor: 'rgba(31, 95, 8, 0.2)',
        borderColor: 'rgba(31, 95, 8, 1)',
        borderWidth: 1
      },
    ],
  };

  const data = {
    labels: ['Ambiental %', 'Social %', 'Governamental %'],

    datasets: [
      {
        label: 'ESG',
        data: [calcPorcentagemEsgCompany(1), calcPorcentagemEsgCompany(2), calcPorcentagemEsgCompany(3)],
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


  const rows = [
    { "Category": "Ambiental", "Estrategico": survey?.ambiental_estrategico, "Planejamento": survey?.ambiental_planejamento, "Controle": survey?.ambiental_controle, "Acao": survey?.ambiental_acao, "Total Geral": survey?.ambiental },
    { "Category": "Social", "Estrategico": survey?.social_estrategico, "Planejamento": survey?.social_planejamento, "Controle": survey?.social_controle, "Acao": survey?.social_acao, "Total Geral": survey?.social },
    { "Category": "Governamental", "Estrategico": survey?.governamental_estrategico, "Planejamento": survey?.governamental_planejamento, "Controle": survey?.governamental_controle, "Acao": survey?.governamental_acao, "Total Geral": survey?.governamental },
    { "Category": "Total Geral", "Estrategico": survey?.total_estrategico, "Planejamento": survey?.total_planejamento, "Controle": survey?.total_controle, "Acao": survey?.total_acao, "Total Geral": survey?.total_geral }
    
  ];
  

  const columnsTable = [
    { title: "ESG/VISÕES", field: "Category", hozAlign: "center", headerSort:false},
    { title: "Estratégico %", field:"Estrategico", hozAlign: "center", headerSort:false},
    { title: "Planejamento %", field:"Planejamento", hozAlign: "center", headerSort:false},
    { title: "Controle %", field:"Controle", hozAlign: "center" , headerSort:false},
    { title: "Ação %", field:"Acao", hozAlign: "center" , headerSort:false},
    { title: "Total Geral %", field:"Total Geral", hozAlign: "center", headerSort:false}
  ];

  const calcularMeta = () => {
    if(company?.esg_goal > survey?.total_geral){
      return (
        <div className={styles.indicadorNao}>
          <h1 style={{fontSize:"1.2rem", fontWeight:"bold", marginBottom:"1rem", whiteSpace:"nowrap"}}>Meta ESG</h1>
          <h1 style={{fontSize:"1.2rem", fontWeight:"bold", marginBottom:"1rem", whiteSpace:"nowrap"}}>{company?.esg_goal}%</h1>
          <div className={styles.metaNao}>
            <h1 style={{whiteSpace:"nowrap"}}>Sua meta ESG não foi alcançada!</h1>
          </div>
        </div>
      )
    }else if(company?.esg_goal <= survey?.total_geral){
      return (
        <div className={styles.indicadorSim}>
          <h1 style={{fontSize:"1.2rem", fontWeight:"bold", marginBottom:"1rem", whiteSpace:"nowrap"}}>Meta ESG</h1>
          <h1 style={{fontSize:"1.2rem", fontWeight:"bold", marginBottom:"1rem", whiteSpace:"nowrap"}}>{company?.esg_goal}%</h1>
          <div className={styles.metaSim}>
            <h1 style={{whiteSpace:"nowrap"}}>Sua meta ESG foi alcançada!</h1>
          </div>
        </div>
      )
    }
  }
  

  const renderComponent = () => {
    if(hasJWT()){
      if(loading){
        return <Loading type="spin" color="#7AA174" width={"60px"} height={"60px"} />
      }else{

        if(user?.user_type !== 2 && user?.id_company === null){
          return (
            <div style={{width:"100%", position:"absolute", top:"0", bottom:"0", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                <IncluirEmpresa texto="Crie seu painel de diagnóstico ESG cadastrando a sua empresa!" temBotao={true}/>
            </div>
           )
        }else if(user?.id_company !== null){
          
          return(
          <div className={styles.containerDashboard}>
            {survey?.ambiental === undefined ? 
            <div style={{width:"100%", position:"absolute", top:"0", bottom:"0", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
              <Loading type="spin" color="#7AA174" width={"60px"} height={"60px"} />
            </div>
            :
            <>
            <div className={styles.graficosColunaUm}>
              <div className={styles.indicadorBarras}>
                  {calcularMeta()}
                <div className={styles.graficoBarra}>
                  <Bar options={optionsBar} data={dataBar}  />
                </div>
              </div>
              <div className={styles.graficoPizza}>
                <Pie data={data}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Divisão ESG da empresa",
                      align: "center",
                   
                      font: {
                        size: 20,
                      }
                    },
                    
                    legend: {
                      display: true,
                      position: "top",
                    
                      labels:{
                        font:{
                          size:15
                        },
                      
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  },
                }}
                />
              </div>
            </div>
            <div className={styles.graficosColunaDois}>
                <div className={styles.gridEsg}>
                <ReactTabulator
                  data={rows}
                  columns={columnsTable}
                  layout={"fitData"}
                  />
                </div>
                <div>
                  <div className={styles.graficoBarra} >
                    <Bar options={optionsBar2} data={dataBar2}  style={{marginLeft:"-1rem"}} />
                  </div>
                </div>
            </div>
            </>
              }
          </div>
          )
        }else{
          return (
              <div style={{width:"100%", position:"absolute", top:"0", bottom:"0", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
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
