import { useContext, useState } from 'react';
import styles from './LoginRegisterForm.module.css'; // Importe o CSS usando CSS Modules
import {toast } from 'react-toastify';
import Link from 'next/link';
import {UserInfo} from "../../context/context";
import { useRouter } from "next/router";
import axios from 'axios';
import { redirect } from 'next/dist/server/api-utils';
import { api } from '@/api/axios';

const LoginRegisterForm = ({tipoForm}) => {

    const {user, setUser } = useContext(UserInfo);

    const router = useRouter();

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
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
        if(nome === "" || email === "" || password === "" || confirmPassword === ""){
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

        try{
            const request = await api.post('/user/add', {
                "name": nome,
                "email":email,
                "password":password
            })

            cleanInputs()
            setUser(request.data)
            notifySuccess("Usuário cadastrado com sucesso!")
        }catch(err){
            notifyError(err.response.data.message);
        }
    

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

        try{
            const request = await api.post('/user/login', {
                "email":email,
                "password":password
            })

            cleanInputs()
            setUser(request)
            console.log(user)
            notifySuccess("Login realizado com sucesso!")
            
        }catch(err){
            notifyError(err.response.data.message);
        }
    }

    return ( 
        <main className={styles.wrapper}>
          <form onSubmit={tipoForm === 1 ? handleLoginUser : handleRegisterUser} className={styles.wrapperInputs}>
            <div className={styles.divInputs} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Nome</label>
                <input onChange={(e) => setNome(e.target.value)} value={nome} className={styles.formInput} type='text' placeholder='Digite o seu nome completo'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>E-mail</label>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className={styles.formInput} type='email' placeholder='Digite o seu email'/>
            </div>
            <div className={styles.divInputs}>
                <label className={styles.formLabel}>Senha</label>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className={styles.formInput} type='password' placeholder='Digite a sua senha'/>
            </div>
            <div className={styles.divInputs} style={{display:tipoForm === 1 ? "none" : "flex"}}>
                <label className={styles.formLabel}>Confirmar Senha</label>
                <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className={styles.formInput} type='password' placeholder='Confime a sua senha'/>
            </div>

            <div className={styles.divLabel}>
                <div className={styles.divLabel}>
                <button className={styles.formButton}>{tipoForm === 1 ? "Entrar" : "Cadastre-se"}</button> 
                </div>
                <label className={styles.lbl1}>{tipoForm === 1 ? "Não possui uma conta?" : "Já possui uma conta?"} </label>
                <Link href={tipoForm === 1 ? "/register" : "/login"} className={styles.lbl2}>{tipoForm === 1 ? "Cadastre-se" : "Entrar"}</Link>
            </div>
          </form>
        </main>
     )
}
 
export default LoginRegisterForm;