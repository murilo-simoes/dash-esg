import LoginRegisterContent from "@/components/LoginRegisterContent";
import Wrapper from "@/components/Wrapper";
import LoginRegisterForm from "@/components/LoginRegisterForm";

const Register = () => {
    const tipoForm = 2

    const router = useRouter();
    let user;
    if (typeof window !== "undefined") {
      user = JSON.parse(localStorage.getItem("user")) || undefined
      
      if(user){
        router.push('/')
      }
    }
    return ( 
        <Wrapper>
            <LoginRegisterContent tipoForm={tipoForm} />
            <LoginRegisterForm tipoForm={tipoForm}/>
        </Wrapper>
     );
}
 
export default Register;