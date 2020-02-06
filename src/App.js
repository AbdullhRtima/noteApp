import React ,{ useState , useEffect } from 'react';
import {
  Switch , 
  Route , 
  BrowserRouter as Router ,
  Redirect,
  useLocation } from 'react-router-dom';
import axios from 'axios';
import api from './ Utilities/api';
import Cookie from "js-cookie";
import history from './history';


// utilites
import PrivateRouter from './ Utilities/PrivateRouter'

// components 

// -1 public
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// -2 private 
import List from './components/note/List';


import './App.css';

const App=()=>{ 

// state 

const [isAuth, setAuth ] = useState(false);
const [errors ,setError ] = useState("");
const [loading ,setLoading ] = useState(false); 



// login fucntions 
const loginSubmit= async(data)=>{
    try{
        const authData= {	"strategy": "local", ...data}
        setLoading(true);
        setAuth(false)
        const res = await axios.post(api("authentication") ,authData);
        Cookie.set('token', res.data.accessToken);
        history.push('/list');
        setLoading(false);
        setAuth(true);
        window.location.reload() 
    }catch(err){
        setError(err.message)
        setLoading(false);
    }}
    // cookie watcher 
    const valid = Cookie.get('token');
    if(valid == null){
      history.push('/'); 
    }else{
      history.push('/list');
    }

    // logout 
    const logout =()=>{
      Cookie.remove('token')
      history.push('/')
      window.location.reload();
    }
    //signp function 
    const signupSubmit= async(data)=>{
      try{
          setLoading(true);
          setAuth(false)
          const res = await axios.post(api("users") ,data);
          Cookie.set('token', res.data.accessToken);
          history.push('/list');
          setLoading(false);
          setAuth(true);
          window.location.reload() 
      }catch(err){
          setError(err.message)
          setLoading(false);
      }}

    // state console test 
    //  console.log(errors)
return (
      <Router>
          <Switch>
              <Route exact path="/">
                <Login
                  loading={loading} 
                  loginSubmit={loginSubmit} 
                  errors={errors}
                  />
               </Route>
                <Route path="/signup">
                    <Signup
                     loading={loading}
                     signupSubmit={signupSubmit} 
                     errors={errors}
                     />
                </Route>
                <PrivateRouter isAuth={isAuth}> 
                    <Route path="/list">
                       <List
                        logout={logout}
                       />
                    </Route>
                </PrivateRouter>
          </Switch>
     </Router>
  );
}
export default App;