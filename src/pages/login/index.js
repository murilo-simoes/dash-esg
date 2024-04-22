import LoginRegisterContent from "@/components/LoginRegisterContent";
import Wrapper from "@/components/Wrapper";
import LoginRegisterForm from "@/components/LoginRegisterForm";

const Login = () => {
    const tipoForm = 1
    return ( 
        <main>
            <Wrapper>
                <LoginRegisterContent tipoForm={tipoForm} />
                <LoginRegisterForm tipoForm={tipoForm}/>
            </Wrapper>
        </main>
     )
}
 
export default Login;