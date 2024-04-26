import LoginRegisterContent from "@/components/LoginRegisterContent";
import Wrapper from "@/components/Wrapper";
import LoginRegisterForm from "@/components/LoginRegisterForm";


const Register = () => {
    const tipoForm = 2
    return ( 
        <Wrapper>
            <LoginRegisterContent tipoForm={tipoForm} />
            <LoginRegisterForm tipoForm={tipoForm}/>
        </Wrapper>
     );
}
 
export default Register;