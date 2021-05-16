import { Button, FormControl, Input, InputLabel } from "@material-ui/core"
import React, { ChangeEvent, Dispatch, useContext, useState } from "react"
import "./Register.scss"
import axios from 'axios'
import { api } from "../../api"
import { AuthContext } from "../../State/Auth/AuthProvider"
import {Redirect, Link} from "react-router-dom"
import { Alert } from "@material-ui/lab"

export const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const {authState, authDispatch} = useContext(AuthContext)
    
    const register = async() => {
        await axios.post(api + "/register", {
            username,
            email,
            password,
            confirmPassword
        }, {
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
            if(res.data.Error) return setError(res.data.Error)
            authDispatch({type: "authenticate", data: res.data})
            return
        })
    }

    if(authState.isAuth) return <Redirect to="/"/>

    return(
        <div className="Register">
            {error && <Alert severity="error" >{error}</Alert>}
            <FormControl>
                <InputLabel htmlFor="username">username</InputLabel>
                <Input id="username" onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="email">email</InputLabel>
                <Input id="email" onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="password">password</InputLabel>
                <Input id="password" type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="confirmPassword">confirm password</InputLabel>
                <Input id="confirmPassword" onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}/>
            </FormControl>
            <Button onClick={register} variant="contained" color="primary">sign up</Button>
            <p>already have an account?</p>
            <Link to="/login" style={{textDecoration: "none"}}>
                <Button color="secondary">login</Button>
            </Link>
            
        </div>
    )
}