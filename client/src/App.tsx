import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import { Login } from './Screens/Login/Login';
import { Register } from './Screens/Register/Register';
import { PrivateRoute } from './PrivateRoute/PrivateRoute';
import { Home } from './Screens/Home/Home';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import { api } from './api';
import { AuthContext } from './State/Auth/AuthProvider';
import {ActionProps} from './State/Auth/AuthReducer'


const App = () => {

  const {authDispatch} = useContext(AuthContext)

  const isAuth = async() => {
    await axios.get(api + "/auth", {
      withCredentials: true
    }).then(async(res) => {
      if(res.status === 403) return
      authDispatch({type: "authenticate", data: res.data})
      return
    })
  }

  useEffect(() => {
    isAuth()
  }, [])
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <PrivateRoute path="/" exact component={Home}/>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
