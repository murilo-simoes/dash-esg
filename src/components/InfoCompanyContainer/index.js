import { useEffect, useState } from 'react';
import styles from './InfoCompanyContainer.module.css'; // Importe o CSS usando CSS Modules
import {toast } from 'react-toastify';
import Loading from '../Loading/Loading';
import { api } from '@/api/axios';
import { useToken } from '@/context/TokenContext';
import Button from '../Button';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const InfoCompanyContainer = ({tipoForm}) => {

    const {user, setUser} = useToken()
    const [manager, setManager] = useState()
    let token = localStorage.getItem('token')

    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState();
    const [open, setOpen] = useState(false);
    const notifySuccess = (text) => toast.success(text);
    const notifyError = (text) => toast.error(text);
    const notifyWarn = (text) => toast.warn(text);

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

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

                const m = await api.post(`/user/find/?id=${c.data.user_id_creator}`, null, {
                    headers: {
                        Authorization:`Bearer ${token}`
                    }
                })

                setManager(m.data)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }

        getCompanyDetails()
    },[token])


    const handleDeleteCompany = async () => {
        try{
         
            const res = await api.post(`/company/delete?id=${company?.id}`, null, {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })
           
            notifySuccess("Empresa deletada com sucesso!")
            window.location.reload() 
        }catch(err){
            notifyError("Não foi possível deletar a empresa!")
        }
        
        onCloseModal()
    }

    return ( 
        <div className={styles.wrapper}>
             <Modal classNames={{
                            overlay: styles.customOverlay,
                            modal: styles.customModal,
                        }} 
                    open={open} onClose={onCloseModal} center>
                <div style={{width:"90%", display:"flex", justifyContent:"flex-start", alignItems:"flex-start", flexDirection:"column"}}>
                    <h1 style={{fontSize:"1.2rem", marginBottom:"1rem"}}>Essa ação irá remover todos os funcionários da empresa e apagar o relatório de diagnóstico ESG!</h1>
                    <h1 style={{marginBottom:"3rem", fontSize:"1.2rem"}}>Tem certeza que deseja apagar a empresa?</h1>
                    <div style={{width:"100%",display:"flex", justifyContent:"flex-start", alignItems:"flex-start"}}>
                        <Button style={{backgroundColor:"#C0C0C0", boxShadow:"0px 4px 15px 0px #C0C0C0"}} click={onCloseModal}>Cancelar</Button>
                        <Button style={{backgroundColor:"#ab0404", boxShadow:"0px 4px 15px 0px #8d0303", marginLeft:"1rem"}} click={handleDeleteCompany}>Apagar empresa</Button>
                    </div>
                </div>
             </Modal>
            {!loading ?
          <div className={styles.wrapperInputs}>
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
                <input disabled={true} value={manager?.name} className={styles.formInput} type='text' placeholder='Gerente da Empresa'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>País sede</label>
                <input disabled={true} value={company?.country} className={styles.formInput} type='text' placeholder='País sede'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>Indústria</label>
                <input disabled={true} value={company?.branch} className={styles.formInput} type='text' placeholder='Indústria'/>
            </div>
            {user?.id === company?.user_id_creator ? <div style={{display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
                <Button style={{backgroundColor:"#ab0404", boxShadow:"0px 4px 15px 0px #8d0303"}} click={onOpenModal}>Apagar empresa</Button>
            </div> : ""}
          </div>
            : <Loading width={"7%"} height={"7%"} type={"spin"} color={"#7AA174"}/>}
        </div>
     )
}
 
export default InfoCompanyContainer;