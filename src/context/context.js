import { createContext, useContext, useState } from "react";

export const UserInfo = createContext({});

export default function Context({ children }){
    const [user, setUser] = useState();
  
    return (
      <UserInfo.Provider value={{ user, setUser }}>
        {children}
      </UserInfo.Provider>
    );
  }
