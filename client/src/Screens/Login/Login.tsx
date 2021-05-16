import { Button, FormControl, Input, InputLabel } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import axios from "axios"
import { ChangeEvent, useContext, useState } from "react"
import { Redirect, Link } from "react-router-dom"
import { api } from "../../api"
import { AuthContext } from "../../State/Auth/AuthProvider"
import "./Login.scss"

export const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const {authState, authDispatch} = useContext(AuthContext)

    const login = async() => {
        await axios.post(api + "/login", {
            email,
            password
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
        <div className="Login">
            {error && <Alert severity="error" >{error}</Alert>}
            <FormControl>
                <InputLabel htmlFor="email">email</InputLabel>
                <Input id="email" onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="password">password</InputLabel>
                <Input id="password" type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
            </FormControl>
            <Button onClick={login} variant="contained" color="primary">
                login
            </Button>
            <p>Don't have an account?</p>
            <Link to="/register" style={{textDecoration: "none"}}>
                <Button color="secondary">
                    register
                </Button>
            </Link>
        </div>
    )
}