import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";
import styles from './AddCompany.module.css'
import IncluirEmpresa from "@/components/IncluirEmpresa";
import WrapperSurvey from "@/components/WrapperSurvey";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import InputMask from 'react-input-mask';
import { validarCNPJ, validarPorcentagem } from "@/functions/validar";
import paises from '../../mock/paises-gentilicos-google-maps.json'
import areas from '../../mock/indutrias-empresas.json'
import questions from '../../mock/perguntas-esg.json'
import { useToken } from "@/context/TokenContext";
import { api } from "@/api/axios";
import { jwtDecode } from "jwt-decode";


const AddCompany = () => {

    const {user, setUser, setCompany, setSurvey} = useToken()
    const router = useRouter();
    let token = localStorage.getItem('token')

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
  
      const config = {
          headers: { 'Authorization': `Bearer ${token}` }
      };
      const decodeToken = jwtDecode(token)
  
        const res = await api.post(`/user/find/?id=${decodeToken?.id}`,null, config)
        setUser(res.data)
        
        if(res.data.id_company !== null){
          router.push('/')
        }
      }
  
      getUser()
    }
    },[token])

    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState(0);
    const [formValues, setFormValues] = useState({})
    const refRadio = useRef(null)

    //#region VARIAVEIS DO FORM DA EMPRESA

      const [nome, setNome] = useState("")
      const [cnpj, setCnpj] = useState("")
      const [industria, setIndustria] = useState("")
      const [pais, setPais] = useState("")
      const [funcionarios, setFuncionarios] = useState("")
      const [indicador, setIndicador] = useState("")
      const valores = [1, 0.75, 0.5, 0.25, 0]

      let valoresPesquisa = {
        id_company:0,
        name: "Painel de diagnóstico ESG",
        ambiental: 0,
        social: 0,
        governamental: 0,
        total_geral: 0,
        total_estrategico:0,
        total_planejamento: 0,
        total_controle: 0,
        total_acao: 0,
        ambiental_estrategico:0,
        ambiental_planejamento: 0,
        ambiental_controle: 0,
        ambiental_acao: 0,
        social_estrategico:0,
        social_planejamento: 0,
        social_controle: 0,
        social_acao: 0,
        governamental_estrategico:0,
        governamental_planejamento: 0,
        governamental_controle: 0,
        governamental_acao: 0,


      }

    //#endregion

    //#region TOASTIFYS
      const notifySuccess = (text) => toast.success(text);
      const notifyError = (text) => toast.error(text);
      const notifyWarn = (text) => toast.warn(text);
    //#endregion


    const perguntasEtapa1 = questions.etapa1.map(item => {
      return {
        id: item.id,
        esg: item.esg, 
        visoes: item.visoes, 
        pergunta: item.pergunta 
      };
    });
    const perguntasEtapa2 = questions.etapa2.map(item => {
      return {
        id: item.id,
        esg: item.esg, 
        visoes: item.visoes, 
        pergunta: item.pergunta 
      };
    });
    const perguntasEtapa3 = questions.etapa3.map(item => {
      return {
        id: item.id,
        esg: item.esg, 
        visoes: item.visoes, 
        pergunta: item.pergunta 
      };
    });
    const perguntasEtapa4 = questions.etapa4.map(item => {
      return {
        id: item.id,
        esg: item.esg, 
        visoes: item.visoes, 
        pergunta: item.pergunta 
      };
    });

    const handleInputChange = (e) => {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
      });
    };

    const handleNextStep = (qty) => {
        if(Object.keys(formValues).length >= qty){
          refRadio.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })

          return setEtapa(etapa + 1)
        }else{
          return notifyWarn("Responda todas as perguntas para passar para a próxima etapa!")
        }
    }


    const validarCamposEmpresa = () => {
      if(nome === "" || cnpj === "" || industria === "" || pais === "" || funcionarios === "" || indicador === "" ){
        notifyWarn("Preencha todos os campos corretamente!")
        return false
      }
    
      if(!validarCNPJ(cnpj)){
         notifyWarn("O CNPJ inserido é inválido!")
         return false
      }

      if(!validarPorcentagem(indicador)){
       notifyWarn("A porcentagem do indicador é inválida, digite de 0 a 100!")
       return false
      }

      return true
    }

    const handleExistsCompany = async () => {

      if(validarCamposEmpresa()){
 
        const res = await api.post(`/company/existe?cnpj=${cnpj}`, null, {
          headers:{
            Authorization : `Bearer ${token}` 
          }
        })

        if(res.data === 0){
          return setEtapa(etapa + 1)
        }else{
          notifyWarn("Já existe uma empresa com esse CNPJ cadastrado!")
        }
        
      }
    }

    const calculoBasicoCategoria = (inicio, final) => {
      let soma = 0;
      let qtyPerguntas = 0;
      for(let i = inicio; i <= final; i++){
        soma += parseFloat(formValues[i])
        qtyPerguntas ++;
      }
      const totalCem = soma * 100;

      const valorFinal = totalCem / qtyPerguntas;

      return valorFinal.toFixed(1)

    }

    const calculoAvancadoCategoria = (inicioUm, finalUm, inicioDois, finalDois, inicioTres, finalTres) => {
      let soma = 0;
      let qtyPerguntas = 0;
      for(let i = inicioUm; i <= finalUm; i++){
        soma += parseFloat(formValues[i])
        qtyPerguntas ++;
      }
      for(let i = inicioDois; i <= finalDois; i++){
        soma += parseFloat(formValues[i])
        qtyPerguntas ++;
      }
      for(let i = inicioTres; i <= finalTres; i++){
        soma += parseFloat(formValues[i])
        qtyPerguntas ++;
      }
      const totalCem = soma * 100;

      const valorFinal = totalCem / qtyPerguntas;

      return valorFinal.toFixed(1)

    }

    const createCompanySurvey = async () => {

      if(Object.keys(formValues).length !== 48){
        return notifyWarn("Responda todas as perguntas para finalizar o questionário!")
      }else{

        // PEGA OS VALORES DA PESQUISA

        valoresPesquisa.ambiental_estrategico = calculoBasicoCategoria(1,4)
        valoresPesquisa.ambiental_planejamento = calculoBasicoCategoria(5,8)
        valoresPesquisa.ambiental_controle = calculoBasicoCategoria(9,12)
        valoresPesquisa.ambiental_acao = calculoBasicoCategoria(13,16)

        valoresPesquisa.social_estrategico = calculoBasicoCategoria(17,20)
        valoresPesquisa.social_planejamento = calculoBasicoCategoria(21,24)
        valoresPesquisa.social_controle = calculoBasicoCategoria(25,28)
        valoresPesquisa.social_acao = calculoBasicoCategoria(29,32)
        
        valoresPesquisa.governamental_estrategico = calculoBasicoCategoria(33,36)
        valoresPesquisa.governamental_planejamento = calculoBasicoCategoria(37,40)
        valoresPesquisa.governamental_controle = calculoBasicoCategoria(41,44)
        valoresPesquisa.governamental_acao = calculoBasicoCategoria(45,48)

        valoresPesquisa.ambiental = calculoBasicoCategoria(1, 16)
        valoresPesquisa.social = calculoBasicoCategoria(17, 32)
        valoresPesquisa.governamental = calculoBasicoCategoria(33, 48)

        valoresPesquisa.total_estrategico = calculoAvancadoCategoria(1,4,17,20,33,36)
        valoresPesquisa.total_planejamento = calculoAvancadoCategoria(5,8,21,24,37,40)
        valoresPesquisa.total_controle = calculoAvancadoCategoria(9,12,25,28,41,44)
        valoresPesquisa.total_acao = calculoAvancadoCategoria(13,16,29,32,45,48)

        valoresPesquisa.total_geral = calculoBasicoCategoria(1,48)

        // INSERE A EMPRESA

        try{
        setLoading(true)
        const bodyCompany = {
          name:nome,
          cnpj:cnpj,
          branch:industria,
          country: pais,
          employee_qty: funcionarios,
          esg_goal: indicador,
          user_id_creator: user?.id
        }

        const company = await api.post('/company/add', bodyCompany, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        })

        let companyId = company.data.id
        const bodySurvey = {
          id_company:companyId,
          name: valoresPesquisa.name,
          ambiental_estrategico: valoresPesquisa.ambiental_estrategico,
          ambiental_planejamento: valoresPesquisa.ambiental_planejamento,
          ambiental_controle: valoresPesquisa.ambiental_controle,
          ambiental_acao: valoresPesquisa.ambiental_acao,
          social_estrategico: valoresPesquisa.social_estrategico,
          social_planejamento: valoresPesquisa.social_planejamento,
          social_controle: valoresPesquisa.social_controle,
          social_acao: valoresPesquisa.social_acao,
          governamental_estrategico: valoresPesquisa.governamental_estrategico,
          governamental_planejamento: valoresPesquisa.governamental_planejamento,
          governamental_controle: valoresPesquisa.governamental_controle,
          governamental_acao: valoresPesquisa.governamental_acao,
          ambiental: valoresPesquisa.ambiental,
          social: valoresPesquisa.social,
          governamental: valoresPesquisa.governamental,
          total_estrategico: valoresPesquisa.total_estrategico,
          total_planejamento: valoresPesquisa.total_planejamento,
          total_controle: valoresPesquisa.total_controle,
          total_acao: valoresPesquisa.total_acao,
          total_geral: valoresPesquisa.total_geral,

        }
        
        const survey = await api.post('/survey/add', bodySurvey, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        })

        setCompany(company.data)
        setSurvey(survey.data)

        notifySuccess("Relatório criado com sucesso!")
        router.push('/')
        

      }catch(err){
        notifyError("Erro ao cadastrar o relatório de diagnóstico ESG!")
      }finally{
        setLoading(false);
      }

      }

    }


    function pegarNumeroAleatorio(array) {
      const indiceAleatorio = Math.floor(Math.random() * array.length);
      return array[indiceAleatorio];
    }

    const devBotao = () => {
      setFormValues({
    1:pegarNumeroAleatorio(valores),
    2:pegarNumeroAleatorio(valores),
    3:pegarNumeroAleatorio(valores),
    4:pegarNumeroAleatorio(valores),
    5:pegarNumeroAleatorio(valores),
    6:pegarNumeroAleatorio(valores),
    7:pegarNumeroAleatorio(valores),
    8:pegarNumeroAleatorio(valores),
    9:pegarNumeroAleatorio(valores),
    10:pegarNumeroAleatorio(valores),
    11:pegarNumeroAleatorio(valores),
    12:pegarNumeroAleatorio(valores),
    13:pegarNumeroAleatorio(valores),
    14:pegarNumeroAleatorio(valores),
    15:pegarNumeroAleatorio(valores),
    16:pegarNumeroAleatorio(valores),
    17:pegarNumeroAleatorio(valores),
    18:pegarNumeroAleatorio(valores),
    19:pegarNumeroAleatorio(valores),
    20:pegarNumeroAleatorio(valores),
    21:pegarNumeroAleatorio(valores),
    22:pegarNumeroAleatorio(valores),
    23:pegarNumeroAleatorio(valores),
    24:pegarNumeroAleatorio(valores),
    25:pegarNumeroAleatorio(valores),
    26:pegarNumeroAleatorio(valores),
    27:pegarNumeroAleatorio(valores),
    28:pegarNumeroAleatorio(valores),
    29:pegarNumeroAleatorio(valores),
    30:pegarNumeroAleatorio(valores),
    31:pegarNumeroAleatorio(valores),
    32:pegarNumeroAleatorio(valores),
    33:pegarNumeroAleatorio(valores),
    34:pegarNumeroAleatorio(valores),
    35:pegarNumeroAleatorio(valores),
    36:pegarNumeroAleatorio(valores),
    37:pegarNumeroAleatorio(valores),
    38:pegarNumeroAleatorio(valores),
    39:pegarNumeroAleatorio(valores),
    40:pegarNumeroAleatorio(valores),
    41:pegarNumeroAleatorio(valores),
    42:pegarNumeroAleatorio(valores),
    43:pegarNumeroAleatorio(valores),
    44:pegarNumeroAleatorio(valores),
    45:pegarNumeroAleatorio(valores),
    46:pegarNumeroAleatorio(valores),
    47:pegarNumeroAleatorio(valores),
    48:pegarNumeroAleatorio(valores)
})
console.log(formValues)
    }

    const renderComponent = () => {
      if(hasJWT()){
      if(user){
        if(user.user_type !== 2 ){

         switch(etapa){
        case 0:
            return (
              <>
                <h1 className={styles.containerTitle}>Criar painel de diagnóstico ESG</h1>
                <WrapperSurvey>
                    <div>
                      <div className={styles.containerTexts}>
                        <h1 className={styles.wrapperTitles}>Como funciona?</h1>
                        <div>
                          <li style={{marginLeft:"1rem"}} className={styles.wrapperText}>Você irá preencher os dados da sua empresa e realizar um questionário. São 48 questões analíticas que você terá que responder de “Discordo Totalmente” a “Concordo Totalmente” para determinar o quão alinhado sua empresa está com as normas <span style={{color:"#49724A", fontWeight:"500"}}>ESG</span>.</li>
                        </div>
                      </div>

                      <div className={styles.containerTexts}>
                        <h1 className={styles.wrapperTitles}>O que acontece depois?</h1>
                        <div>
                          <li style={{marginLeft:"1rem"}} className={styles.wrapperText}>Assim que finalizar o questionário, sua empresa será cadastrada e você será redirecionado para o <span style={{color:"#49724A", fontWeight:"500"}}>Dashboard</span> gerado com os resultados do questionário.</li>
                        </div>
                      </div>

                      <div className={styles.containerTexts}>
                        <h1 className={styles.wrapperTitles}>Quanto tempo dura?</h1>
                        <div>
                          <li style={{marginLeft:"1rem"}} className={styles.wrapperText}>O questionário leva em média 10 minutos para ser finalizado.</li>
                        </div>
                      </div>
                    </div>

                    <div className={styles.wrapperButton}>
                      <Button click={() => setEtapa(1)} text={'Começar questionário'}/>
                    </div>
                </WrapperSurvey>
                <div style={{visibility:"hidden"}} className={styles.barraProgresso}>
                      <div className={styles.barraProgressoVerde}></div>
                </div>
              </>
        )
        case 1:        
          return (
            <>
              <h1 className={styles.containerTitle}>Criar painel de diagnóstico ESG</h1>
              <WrapperSurvey>
                  <div style={{display:"flex", flexDirection:"column", height:"auto"}}>
                    <div className={styles.wrapperInputsDois}>
                      <div className={styles.divInputsDois}>
                        <label className={styles.formLabelDois}>Nome</label>
                        <input onChange={(e) => setNome(e.target.value)} value={nome} className={styles.formInputDois} type='text' placeholder='Digite o nome da empresa'/>
                      </div>
                      <div className={styles.divInputsDois}>
                        <label className={styles.formLabelDois}>CNPJ</label>
                        <InputMask mask="99.999.999/9999-99" value={cnpj} className={styles.formInputDois} onChange={(e) => setCnpj(e.target.value)} type='tel' maskChar={null}placeholder='Digite o CNPJ da empresa' />
                      </div>
                    </div>
                    
                    <div className={styles.wrapperInputsUm}>
                      <div className={styles.divInputsUm}>
                        <label className={styles.formLabelUm}>Industria</label>
                        <select onChange={(e) => setIndustria(e.target.value)} value={industria} style={{cursor:"pointer"}} className={styles.formInputUm}>
                          <option value="" disabled hidden>Escolha uma opção</option>
                          {areas.map((item) => <option key={item.id} value={item.nome}>{item.nome}</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className={styles.wrapperInputsUm}>
                      <div className={styles.divInputsUm}>
                        <label className={styles.formLabelUm}>País</label>
                        <select onChange={(e) => setPais(e.target.value)} value={pais} style={{cursor:"pointer"}} className={styles.formInputUm}>
                          <option value="" disabled hidden>Escolha uma opção</option>
                          {paises.map((item) => <option key={item.sigla} value={item.nome_pais}>{item.nome_pais}</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className={styles.wrapperInputsDois}>
                      <div className={styles.divInputsDois}>
                        <label className={styles.formLabelDois}>Numero de funcionários</label>
                        <select onChange={(e) => setFuncionarios(e.target.value)} value={funcionarios} style={{cursor:"pointer"}} className={styles.formInputDois}>
                          <option value="" disabled hidden>Escolha uma opção</option>
                          <option value="De 0 a 10 funcionários">De 0 a 10 funcionários</option>
                          <option value="De 11 a 49 funcionários">De 11 a 49 funcionários</option>
                          <option value="De 50 a 149 funcionários">De 50 a 149 funcionários</option>
                          <option value="De 150 a 149 funcionários">De 150 a 149 funcionários</option>
                          <option value="De 500 a 999 funcionários">De 500 a 999 funcionários</option>
                          <option value="Mais de 1000 funcionários">Mais de 1000 funcionários</option>
                        </select>
                      </div>
                      <div className={styles.divInputsDois}>
                        <label className={styles.formLabelDois}>Indicador/Meta ESG</label>
                        <InputMask mask="999" maskChar={null} value={indicador} min={"0"} max={"100"} className={styles.formInputDois} onChange={(e) => setIndicador(e.target.value)} type='tel' placeholder='Digite o indicador ESG em %' />
                      </div>
                    </div>
  
                  </div>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div className={styles.wrapperButton}>
                      <Button disabled="true" style={{backgroundColor:"#C0C0C0", visibility:"hidden"}} click={() => setEtapa(etapa - 1)} text={'Voltar'}/>
                    </div>
                    <div className={styles.wrapperButton}>
                      <Button click={handleExistsCompany} text={'Próxima etapa'}/>
                    </div>
                  </div>
              </WrapperSurvey>
              <div className={styles.barraProgresso}>
                  <div style={{width:"0%"}} className={styles.barraProgressoVerde}></div>
              </div>              
            </>
        )
        case 2:
          return (
            <>
              <h1 className={styles.containerTitle}>Criar painel de diagnóstico ESG</h1>
              <WrapperSurvey>
              { user?.email === "murilorsimoes@gmail.com" ?                     
              <div className={styles.wrapperButton}>
                      <Button style={{backgroundColor:"#49724A", marginBottom:"2rem"}} click={devBotao} text={'BOTÂO DEV'}/>
              </div> : ""}
                <div ref={refRadio}></div>
                {perguntasEtapa1.map((item) => {
                  return(
                  <div key={item?.id} className={styles.containerRadio}>
                    <h1 className={styles.wrapperTitles}><span  style={{color:"#49724A", fontWeight:"bold"}}>{item?.id}.</span> {item.pergunta}</h1>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "1"} type="radio" className={styles.radioEsg} name={item?.id} value={1}/>
                      <label htmlFor="1">Concordo totalmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.75"} type="radio" className={styles.radioEsg} name={item?.id} value={0.75}/>
                      <label htmlFor="2">Concordo parcialmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.5"}  type="radio" className={styles.radioEsg}  name={item?.id} value={0.5}/>
                      <label htmlFor="3">Neutro</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.25"} type="radio" className={styles.radioEsg}  name={item?.id} value={0.25}/>
                      <label htmlFor="4">Discordo parcialmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0"}  type="radio" className={styles.radioEsg}  name={item?.id} value={0}/>
                      <label htmlFor="5">Discordo totalmente</label>
                    </div>
                  </div>
                  )
                  })}
                  
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div className={styles.wrapperButton}>
                      <Button style={{backgroundColor:"#C0C0C0"}} click={() => setEtapa(etapa - 1)} text={'Voltar'}/>
                    </div>
                    <div className={styles.wrapperButton}>
                      <Button click={() => handleNextStep(12)} text={'Próxima etapa'}/>
                    </div>
                  </div>
              </WrapperSurvey>
              <div className={styles.barraProgresso}>
                  <div style={{width:"calc(100% * 0.2)"}} className={styles.barraProgressoVerde}></div>
              </div>
            </>
        )
        case 3:
          return (
            <>
              <h1 className={styles.containerTitle}>Criar painel de diagnóstico ESG</h1>
              <WrapperSurvey>
              <div ref={refRadio}></div>
              {perguntasEtapa2.map((item) => {
                  return(
                    <div key={item?.id} className={styles.containerRadio}>
                      <h1 className={styles.wrapperTitles}><span  style={{color:"#49724A", fontWeight:"bold"}}>{item?.id}.</span> {item.pergunta}</h1>
                      <div className={styles.wrapperAnswer}>
                        <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "1"} type="radio" className={styles.radioEsg} name={item?.id} value={1}/>
                        <label htmlFor="1">Concordo totalmente</label>
                      </div>
                      <div className={styles.wrapperAnswer}>
                        <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.75"} type="radio" className={styles.radioEsg} name={item?.id} value={0.75}/>
                        <label htmlFor="2">Concordo parcialmente</label>
                      </div>
                      <div className={styles.wrapperAnswer}>
                        <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.5"}  type="radio" className={styles.radioEsg}  name={item?.id} value={0.5}/>
                        <label htmlFor="3">Neutro</label>
                      </div>
                      <div className={styles.wrapperAnswer}>
                        <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.25"} type="radio" className={styles.radioEsg}  name={item?.id} value={0.25}/>
                        <label htmlFor="4">Discordo parcialmente</label>
                      </div>
                      <div className={styles.wrapperAnswer}>
                        <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0"}  type="radio" className={styles.radioEsg}  name={item?.id} value={0}/>
                        <label htmlFor="5">Discordo totalmente</label>
                      </div>
                    </div>
                    )
                  })}
                  
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div className={styles.wrapperButton}>
                      <Button style={{backgroundColor:"#C0C0C0"}} click={() => setEtapa(etapa - 1)} text={'Voltar'}/>
                    </div>
                    <div className={styles.wrapperButton}>
                      <Button click={() => handleNextStep(24)} text={'Próxima etapa'}/>
                    </div>
                  </div>
              </WrapperSurvey>
              <div className={styles.barraProgresso}>
                  <div style={{width:"calc(100% * 0.4)"}} className={styles.barraProgressoVerde}></div>
              </div>
            </>
        )
        case 4:
          return (
            <>
              <h1 className={styles.containerTitle}>Criar painel de diagnóstico ESG</h1>
              <WrapperSurvey>
              <div ref={refRadio}></div>
              {perguntasEtapa3.map((item) => {
                  
                  return(
                  <div key={item?.id} className={styles.containerRadio}>
                    <h1 className={styles.wrapperTitles}><span  style={{color:"#49724A", fontWeight:"bold"}}>{item?.id}.</span> {item.pergunta}</h1>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "1"} type="radio" className={styles.radioEsg} name={item?.id} value={1}/>
                      <label htmlFor="1">Concordo totalmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.75"} type="radio" className={styles.radioEsg} name={item?.id} value={0.75}/>
                      <label htmlFor="2">Concordo parcialmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.5"}  type="radio" className={styles.radioEsg}  name={item?.id} value={0.5}/>
                      <label htmlFor="3">Neutro</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.25"} type="radio" className={styles.radioEsg}  name={item?.id} value={0.25}/>
                      <label htmlFor="4">Discordo parcialmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0"}  type="radio" className={styles.radioEsg}  name={item?.id} value={0}/>
                      <label htmlFor="5">Discordo totalmente</label>
                    </div>
                  </div>
                  )
                  })}
                  
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div className={styles.wrapperButton}>
                      <Button style={{backgroundColor:"#C0C0C0"}} click={() => setEtapa(etapa - 1)} text={'Voltar'}/>
                    </div>
                    <div className={styles.wrapperButton}>
                      <Button click={() => handleNextStep(36)} text={'Próxima etapa'}/>
                    </div>
                  </div>
              </WrapperSurvey>
              <div className={styles.barraProgresso}>
                  <div style={{width:"calc(100% * 0.6)"}} className={styles.barraProgressoVerde}></div>
              </div>
            </>
        )
        case 5:
          return (
            <>
              <h1 className={styles.containerTitle}>Criar painel de diagnóstico ESG</h1>
              <WrapperSurvey>
              <div ref={refRadio}></div>
              {perguntasEtapa4.map((item) => {
                  
                  return(
                  <div key={item?.id} className={styles.containerRadio}>
                    <h1 className={styles.wrapperTitles}><span  style={{color:"#49724A", fontWeight:"bold"}}>{item?.id}.</span> {item.pergunta}</h1>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "1"} type="radio" className={styles.radioEsg} name={item?.id} value={1}/>
                      <label htmlFor="1">Concordo totalmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.75"} type="radio" className={styles.radioEsg} name={item?.id} value={0.75}/>
                      <label htmlFor="2">Concordo parcialmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.5"}  type="radio" className={styles.radioEsg}  name={item?.id} value={0.5}/>
                      <label htmlFor="3">Neutro</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0.25"} type="radio" className={styles.radioEsg}  name={item?.id} value={0.25}/>
                      <label htmlFor="4">Discordo parcialmente</label>
                    </div>
                    <div className={styles.wrapperAnswer}>
                      <input onChange={(e) => handleInputChange(e)} checked={formValues[item?.id] === "0"}  type="radio" className={styles.radioEsg}  name={item?.id} value={0}/>
                      <label htmlFor="5">Discordo totalmente</label>
                    </div>
                  </div>
                  )
                  })}
                  
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div className={styles.wrapperButton}>
                      <Button style={{backgroundColor:"#C0C0C0"}} click={() => setEtapa(etapa - 1)} text={'Voltar'}/>
                    </div>
                    <div className={styles.wrapperButton}>
                      { !loading ?
                        <Button disable={loading === false ? false : true} click={createCompanySurvey}>Finalizar questionário</Button>
                       :<div className={styles.loadingDiv}><Loading width={"50%"} height={"50%"} type={"spin"} color={"#7AA174"}/></div>
                       }
                    </div> 
                  </div>
              </WrapperSurvey>
              <div className={styles.barraProgresso}>
                  <div style={{width:"calc(100% * 0.8)"}} className={styles.barraProgressoVerde}></div>
              </div>
            </>
        )
        }
          
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
    }else{
      router.push('/login')
    }
    }
    return ( 
        <>
         <div className={styles.container}>
          {renderComponent()}
         </div>
        </>
     );
}
 
export default AddCompany;