import { useContext } from "react";
import {UserInfo} from "../context/context";


export default function Home() {
  const { user } = useContext(UserInfo);
  return (
    <>
      <main>
        <h1>
          {/* {user.name} */}
          teste
        </h1>
      </main>
    </>
  );
}
