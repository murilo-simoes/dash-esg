import { useEffect, useState } from 'react';
import styles from './LoginRegisterForm.module.css'; // Importe o CSS usando CSS Modules
import {toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from "next/router";
import { api } from '@/api/axios';
import ReactLoading from 'react-loading';
import Loading from '../Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const LoginRegisterForm = ({tipoForm}) => {

    const router = useRouter();
    
    let user;
    if (typeof window !== "undefined") {
      user = JSON.parse(localStorage.getItem("user")) || undefined
      
      if(user){
        router.push('/')
      }
    }

    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [userType, setUserType] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [classShadow, setClassShadow] = useState(false)
    const [classShadow2, setClassShadow2] = useState(false)
    const notifySuccess = (text) => toast.success(text);
    const notifyError = (text) => toast.error(text);
    const notifyWarn = (text) => toast.warn(text);



    function cleanInputs(){
        setNome("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
    }

    async function handleRegisterUser(e){
        e.preventDefault();
        if(nome === "" || email === "" || password === "" || confirmPassword === "" || userType === ""){
            return notifyWarn("Preencha todos os campos corretamente!")
        }

        if(nome.length <= 3){
            return notifyWarn("O nome precisa ter mais de 3 caracteres!")
        }

        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!regexEmail.test(email)){
            return notifyWarn("O e-mail inserido é inválido!")
        }

        if(password <= 6){
            return notifyWarn("A senha deve conter pelo menos 6 caracteres!")
        }

        if(password != confirmPassword){
            return notifyWarn("As senhas inseridas devem ser iguais!")
        }

        setLoading(true)
        await api.post('/user/add', {
            "name": nome,
            "email":email,
            "password":password,
            "user_type":parseInt(userType)
        }).then((res) => {
            cleanInputs()
            localStorage.setItem("user", JSON.stringify(res.data));
            notifySuccess("Usuário cadastrado com sucesso!")
            router.push('/').catch((err) => {
                notifyError(err)
            })
        }).catch((err) => {
            notifyError(err.response.data.message)
        }).finally(() => {
            setLoading(false)
        })

    }

    async function handleLoginUser(e){
        e.preventDefault();
        if(email === "" || password === ""){
            return notifyWarn("Preencha todos os campos corretamente!")
        }
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!regexEmail.test(email)){
            return notifyWarn("O e-mail inserido é inválido!")
        }

        if(password <= 6){
            return notifyWarn("A senha deve conter pelo menos 6 caracteres!")
        }
        setLoading(true)
        await api.post('/user/login', {
            "email":email,
            "password":password
        }).then((res) => {
            cleanInputs()
            localStorage.setItem("user", JSON.stringify(res.data));
            notifySuccess("Login realizado com sucesso!")
            router.push('/').catch((err) => {
                notifyError(err)
            })
        }).catch((err) => {
            notifyError(err.response.data.message)
        }).finally(() => {
            setLoading(false)
        })
    }

    return ( 
        <div className={styles.wrapper}>
          <form onSubmit={tipoForm === 1 ? handleLoginUser : handleRegisterUser} className={styles.wrapperInputs}>
            <div className={styles.divInputs} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Nome</label>
                <input onChange={(e) => setNome(e.target.value)} value={nome} className={styles.formInput} type='text' placeholder='Digite o seu nome completo'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>E-mail</label>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className={styles.formInput} type='email' placeholder='Digite o seu email'/>
            </div>
            <div className={styles.divInputs} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Tipo de usuário</label>
                <select  value={userType} onChange={(e) => setUserType(e.target.value)} style={{cursor:"pointer"}} className={styles.formInput}>
                    <option value="" disabled hidden>Escolha uma opção</option>
                    <option value="1">Gerente</option>
                    <option value="2">Funcionário</option>
                </select>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>Senha</label>
                <div className={classShadow === false ? styles.divInputSenha : styles.divInputSenhaShadow}>
                    <input onFocus={() => setClassShadow(true)} onBlur={() => setClassShadow(false)} onChange={(e) => setPassword(e.target.value)} value={password} className={styles.formInputSenha} type={showPassword === false ? "password" : "text"} placeholder='Digite a sua senha'/>
                    <div className={styles.divIconPass}>
                        <FontAwesomeIcon onClick={() => setShowPassword(showPassword === false ? true : false)} className={styles.iconPass} icon={showPassword === false ? faEyeSlash : faEye} />
                    </div>
                </div>
            </div>
            <div className={styles.divInputs} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Confirmar senha</label>
                <div className={classShadow2 === false ? styles.divInputSenha : styles.divInputSenhaShadow}>
                    <input onFocus={() => setClassShadow2(true)} onBlur={() => setClassShadow2(false)} onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className={styles.formInputSenha} type={showPassword2 === false ? "password" : "text"} placeholder='Confime a sua senha'/>
                    <div className={styles.divIconPass}>
                        <FontAwesomeIcon onClick={() => setShowPassword2(showPassword2 === false ? true : false)} className={styles.iconPass} icon={showPassword2 === false ? faEyeSlash : faEye} />
                    </div>
                </div>
            </div>

            <div className={styles.divLabel}>
                <div className={styles.divLabel}>
                    <button disabled={ loading === false ? false : true} className={styles.formButton}>
                        { loading === false ? (tipoForm === 1 ? "Entrar" : "Cadastre-se") : <Loading width={"15%"} height={"15%"} type={"spin"} color={"#7AA174"}/>}
                    </button> 
                </div>
                <label className={styles.lbl1}>{tipoForm === 1 ? "Não possui uma conta?" : "Já possui uma conta?"} </label>
                <Link href={tipoForm === 1 ? "/register" : "/login"} className={styles.lbl2}>{tipoForm === 1 ? "Cadastre-se" : "Entrar"}</Link>
            </div>
          </form>
        </div>
     )
}
 
export default LoginRegisterForm;