import styles from './AddEmployee.module.css'
import IncluirEmpresa from '@/components/IncluirEmpresa';
import Loading from '@/components/Loading/Loading';
import { useRouter } from 'next/router';

const addEmployee = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
            if(user.id_company !== null){
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
    }

    return ( 
        <>
            {renderComponent()}
        </>
     );
}
 
export default addEmployee;