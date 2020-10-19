import React from 'react';
import './App.css';
import SignIn from './Views/Sign/SignIn';
import SignUp from './Views/Sign/SignUp';
import Upload from './Views/Upload/Upload';
import Template from './Template/Template';
import Files from './Views/Files/Files';
import Grid from '@material-ui/core/Grid';
import { signInAction,fileAction} from "./Actions";
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
function App() {
  var dispatch=useDispatch();
  var jwt=window.sessionStorage.getItem("jwt");
  if(jwt!=='null'){
    var email=window.sessionStorage.getItem("email");
    dispatch(signInAction('',jwt)) 
    dispatch(fileAction(email,'',[{"child":email,"childName":""}]))
  }
  return (
    <Grid >
      <Router>
      <Template/>
      <Switch> 
          <Route path="/login">
            <SignIn/>
          </Route>
          <Route path="/upload">
            <Upload/>
          </Route>
          <Route path="/files">
            <Files/>
          </Route>
          <Route path="/register">
            <SignUp/>
          </Route>
          <Route path="/">
             <SignIn />
         </Route>
        </Switch>
      </Router>
    </Grid>
      
    
  );
}

export default App;
