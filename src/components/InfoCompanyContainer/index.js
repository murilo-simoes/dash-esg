import { useEffect, useState } from 'react';
import styles from './InfoCompanyContainer.module.css'; // Importe o CSS usando CSS Modules
import {toast } from 'react-toastify';
import Loading from '../Loading/Loading';
import { api } from '@/api/axios';
import { useToken } from '@/context/TokenContext';


const InfoCompanyContainer = ({tipoForm}) => {

    const {user, setUser} = useToken()
    let token = localStorage.getItem('token')

    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState();
    const notifySuccess = (text) => toast.success(text);
    const notifyError = (text) => toast.error(text);
    const notifyWarn = (text) => toast.warn(text);

    function formatarData(dataString) {
        var data = new Date(dataString);
        var dia = data.getDate().toString().padStart(2, '0');
        var mes = (data.getMonth() + 1).toString().padStart(2, '0');
        var ano = data.getFullYear();
        return dia + '/' + mes + '/' + ano;
    }


    useEffect(() => {
        const getCompanyDetails = async () =>{
            try{
                const c = await api.post(`/company/find/?id=${user?.id_company}` ,null,{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                setCompany(c.data)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }

        getCompanyDetails()
    },[token])

    return ( 
        <div className={styles.wrapper}>
            {!loading ?
          <form className={styles.wrapperInputs}>
            <div className={styles.divCreated} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Quantidade de funcionários:&nbsp;</label>
                <label className={styles.formLabel}>{company?.employee_qty}</label>
            </div>
            <div className={styles.divCreated} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Empresa criada em:&nbsp;</label>
                <label className={styles.formLabel}>{formatarData(company?.created_at)}</label>
            </div>
            <div className={styles.divCreated} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Meta ESG:&nbsp;</label>
                <label className={styles.formLabel}>{company?.esg_goal}%</label>
            </div>
            <div className={styles.divInputs} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Nome da empresa</label>
                <input disabled={true} value={company?.name} className={styles.formInput} type='text' placeholder='Nome'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>CNPJ</label>
                <input disabled={true} value={company?.cnpj} className={styles.formInput} type='text' placeholder='Cnpj'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>Gerente da empresa</label>
                <input disabled={true} value={user.name} className={styles.formInput} type='text' placeholder='Cnpj'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>País sede</label>
                <input disabled={true} value={company?.country} className={styles.formInput} type='text' placeholder='Cnpj'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>Indústria</label>
                <input disabled={true} value={company?.branch} className={styles.formInput} type='text' placeholder='Cnpj'/>
            </div>
          </form>
            : <Loading width={"10%"} height={"10%"} type={"spin"} color={"#7AA174"}/>}
        </div>
     )
}
 
export default InfoCompanyContainer;