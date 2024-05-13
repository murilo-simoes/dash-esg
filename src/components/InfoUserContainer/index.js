import { useState } from 'react';
import styles from './InfoUserContainer.module.css'; // Importe o CSS usando CSS Modules
import {toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from "next/router";
import { api } from '@/api/axios';
import ReactLoading from 'react-loading';
import Loading from '../Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useToken } from '@/context/TokenContext';

const InfoUserContainer = ({tipoForm}) => {

    const {user, setUser} = useToken()

    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState(user?.name)
    const [email, setEmail] = useState(user?.email)
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

    function cleanInputs(){
        setNome("")
        setEmail("")
    }



    return ( 
        <div className={styles.wrapper}>
          <form className={styles.wrapperInputs}>
            
            <div className={styles.divCreated} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Tipo de conta:&nbsp;</label>
                <label className={styles.formLabel}>{user?.user_desc}</label>
            </div>
            <div className={styles.divCreated} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Conta criada em:&nbsp;</label>
                <label className={styles.formLabel}>{formatarData(user?.created_at)}</label>
            </div>
            <div className={styles.divInputs} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Nome</label>
                <input disabled={true} onChange={(e) => setNome(e.target.value)} value={nome} className={styles.formInput} type='text' placeholder='Nome'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>E-mail</label>
                <input disabled={true} onChange={(e) => setEmail(e.target.value)} value={email} className={styles.formInput} type='email' placeholder='E-mail'/>
            </div>

            <div style={{display:"none"}} className={styles.divLabel}>
                <button disabled={ loading === false ? false : true} className={styles.formButton}>
                    { loading === false ? "Salvar" : <Loading width={"15%"} height={"15%"} type={"spin"} color={"#7AA174"}/>}
                </button> 
            </div>
          </form>
        </div>
     )
}
 
export default InfoUserContainer;