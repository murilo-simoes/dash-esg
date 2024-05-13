import { api } from '@/api/axios';
import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const TokenContext = createContext("");

export function TokenProvider({children}){
    const [token, setToken] = useState(undefined);
    const [user, setUser] = useState(undefined)
    const [company, setCompany] = useState(undefined)
    const [survey, setSurvey] = useState(undefined)

    const tokenMemo = useMemo(() => ({
        token, 
        setToken, 
        user, 
        setUser, 
        company, 
        setCompany, 
        survey, 
        setSurvey
    }), [token, setToken, user, setUser, company, setCompany, survey, setSurvey])

    
    return(
        <TokenContext.Provider value={tokenMemo}>
            {children}
        </TokenContext.Provider>
    )
}

export function useToken(){
    return useContext(TokenContext)
}