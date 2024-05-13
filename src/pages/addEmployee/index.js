import { api } from '@/api/axios';
import styles from './AddEmployee.module.css'
import IncluirEmpresa from '@/components/IncluirEmpresa';
import Loading from '@/components/Loading/Loading';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useToken } from '@/context/TokenContext';

const AddEmployee = () => {
  
    const router = useRouter();
    const {user, setUser} = useToken();
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
        
      }
  
      getUser()
    }
    },[token])



    const renderComponent = () => {
      if(hasJWT()){
        
        if(user){
          if(user?.user_type !== 2 ){
              if(user?.id_company !== null){
                  return (
                      <div className={styles.container} >
                          <h1>ADD EMPLOYEE</h1>
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
            {renderComponent()}
        </>
     );
}
 
export default AddEmployee;