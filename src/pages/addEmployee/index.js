import { api } from '@/api/axios';
import styles from './AddEmployee.module.css'
import IncluirEmpresa from '@/components/IncluirEmpresa';
import Loading from '@/components/Loading/Loading';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useToken } from '@/context/TokenContext';
import InfoUser from '@/components/InfoUser';
import WrapperSurvey from '@/components/WrapperSurvey';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AddEmployee = () => {
  
    const router = useRouter();
    const {user, setUser} = useToken();
    const [email, setEmail] = useState("");
    const [employee, setEmployee] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingEmployee, setLoadingEmployee] = useState(false);
    const notifyError = (text) => toast.error(text);
    const notifySuccess = (text) => toast.success(text);
    const notifyWarn = (text) => toast.warn(text);
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

    const handleFetchEmployee = async (data) => {
      try{
        setLoadingEmployee(true)
          const config = {
            headers: { 'Authorization': `Bearer ${token}` }
      };
        const com = await api.post(`/user/findEmployees?id_company=${data}`,null, config)
        
        setEmployee(com.data)
    }catch(err){
      notifyError("Erro ao carregar os funcionários")
    }finally{
      setLoadingEmployee(false)
    }
    }

    useEffect(() => {
      if(hasJWT()){
      try{
        const getUser = async() => {
    
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };
        const decodeToken = jwtDecode(token)
    
          const res = await api.post(`/user/find/?id=${decodeToken?.id}`,null, config)
          setUser(res.data)

          handleFetchEmployee(res?.data?.id_company)
          
        }
      
        getUser() 
      }catch(err){
        notifyError("Erro ao pegar as informações do usuário e seus funcionarios")
      }
        
    }
    },[token])



    const handleAddEmployee = async (e) => {
      e.preventDefault();
      setLoading(true)

      const body = {
        email:email,
        id_company: user?.id_company
      }
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
    };
      try{
        await api.post('/company/addEmployee', body, config)

        handleFetchEmployee(user?.id_company)
        notifySuccess("Funcionário adicionado com sucesso!")
        setEmail("")
      }catch(err){
        notifyError(err.response.data.message)
      }finally{
        setLoading(false)
      }
    }
    const handleRemoveEmployee = async (email) => {
      try{
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };
        const res = await api.post(`/company/removeEmployee?email=${email}`, null, config)

        handleFetchEmployee(user?.id_company)
        notifySuccess(res.data)
      }catch(err){
        notifyError("Erro ao remover o funcionário!")
      }
    }

    const renderComponent = () => {
      if(hasJWT()){
        
        if(user){
          if(user?.user_type !== 2 ){
              if(user?.id_company !== null){
                  return (
                    <div className={styles.container}>
                       <h1 className={styles.containerTitle}>Adicionar funcionários à empresa</h1>
                      <WrapperSurvey estilo={{justifyContent:"flex-start"}}>
                        <div className={styles.wrapperAdd}>
                          <h1 className={styles.titleInput}>Email do funcionário</h1>
                          <form className={styles.inputAddDiv}>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} className={styles.formInput} type='text' placeholder='Email'/>
                            { loading ? <Loading width={"30px"} height={"30px"} type={"spin"} color={"#7AA174"}/> : <div onClick={handleAddEmployee} className={styles.addEmployee}> <FontAwesomeIcon className={styles.iconButton} icon={faPlus} /></div>}
                          </form>
                        </div>
                        <div className={styles.listEmployee}>
                          <h1 className={styles.titleInput}>Lista de funcionários cadastrados</h1>
                          {
                            loadingEmployee ?
                            <Loading width={"25px"} height={"25px"} type={"spin"} color={"#7AA174"}/>
                            :
                            employee?.map((item) => {
                              return(
                                <div key={item.id} className={styles.employee}>
                                  <div className={styles.employeeSubDiv}>
                                    <label className={styles.employeeName}>{item?.name} - {item?.email}</label>
                                    {item.id === user?.id ? <FontAwesomeIcon className={styles.iconButtonManager} icon={faUser} /> : <FontAwesomeIcon onClick={() => handleRemoveEmployee(item.email)} className={styles.iconButtonEmployee} icon={faTrash} />}
                                  </div>
                               </div>
                              )
                            })
                          }
                        </div>
                      </WrapperSurvey>
                    </div>
                  )
              }else{
                  return <IncluirEmpresa texto="Cadastre sua empresa para adicionar funcionários!" temBotao={true}/>
              }
        }else{
          return <IncluirEmpresa texto="Você não tem autorização para incluir funcionarios!" temBotao={false}/>
        }
        }else{
          return (
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
 
export default AddEmployee;