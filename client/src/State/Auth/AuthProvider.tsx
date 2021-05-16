import React, { createContext, Dispatch, useReducer } from "react";
import { ActionProps, AuthReducer } from "./AuthReducer";

export interface StateProps{
    username: string
    email: string
    isAuth: boolean
}

const defaultValue: StateProps = {
    username: "",
    email: "",
    isAuth: false
}

export interface Content{
    authState: StateProps
    authDispatch: React.Dispatch<ActionProps>
}

export const AuthContext = createContext<Content>({
    authState: defaultValue, 
    authDispatch: () => {}})


export const AuthProvider: React.FC = ({children}) => {
    const [authState, authDispatch] = useReducer(AuthReducer, defaultValue)

    return(
        <AuthContext.Provider value={{authState, authDispatch}}>
            {children}
        </AuthContext.Provider>
    )
}
