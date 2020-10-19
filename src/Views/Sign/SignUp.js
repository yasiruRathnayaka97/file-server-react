import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import React, { useEffect,useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useDispatch} from 'react-redux';
import { signInAction,fileAction} from "../../Actions";
require('dotenv').config();
const base=process.env.REACT_APP_REST_API_BASE;
const axios = require('axios');
const useStyles = makeStyles((theme) => ({
 root: {
   display: 'flex',
   flexWrap: 'wrap',
   '& > *': {
     margin: theme.spacing(6),
     width: theme.spacing(40),
     height: theme.spacing(55),
   },
 },
 text:{
   paddingLeft:theme.spacing(6),
   paddingRight:theme.spacing(6),
   paddingTop:15,
 },
 button:{
   paddingLeft:theme.spacing(13.5),
   paddingRight:theme.spacing(13.5),
   paddingTop:10,

 },
 typography:{
   paddingTop:10

 },
 alert:{
  paddingLeft:theme.spacing(5.5),
  paddingRight:theme.spacing(5.5),
  paddingTop:5,
}

}));

export default function SignUp() {
  const inputProps={
    maxLength: 24
  }
 const classes = useStyles('');
 const [email, setEmail] = useState('');
 const [userName, setUserName] = useState('');
 const [password, setPassword] = useState('');
 const [repeatPassword, setRepeatPassword] = useState('');
 const [alertMeassage,setAlert]=useState();
 const [count,setCount]=useState(0);
 var history=useHistory()
 var dispatch=useDispatch();

 const fetchData = async () => {
 
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(userName===''||email===''||password===''||repeatPassword===''){
    setAlert(<Alert severity="error" >please fill all the fields</Alert>)
   }
  else if(!re.test(String(email).toLowerCase())){
   setAlert(<Alert severity="error" >wrong email</Alert>)
  }
  else if(password.length<8){
   setAlert(<Alert severity="error" >password min-length:8</Alert>)
      
  }
  else if(password!==repeatPassword){
      setAlert(<Alert severity="error" >different repeat-password</Alert>)
   }
  else{
  axios.post(base+'/account/signup', {
    userName:userName,
    password:password,
    email:email
  })
  .then(res=>{
    if(res.data.status==="Account exist"){
    setAlert(<Alert severity="warning">{res.data.status}</Alert>)
    }
    else{
      setAlert(<Alert severity="success">{res.data.status}</Alert>)
      window.sessionStorage.setItem("jwt",res.data.jwt);
      window.sessionStorage.setItem("email",email);
      dispatch(signInAction(email,res.data.jwt))   
      dispatch(fileAction(email,'',[{"child":email,"childName":""}]))
      history.push('/files')
    }
   } 
).catch(function (error) {
    console.log(error);
  });
  return
}
 }
  useEffect(()=>{
    if(count>0){
    fetchData();
  }
},[count])

const handleSubmit =() => {
  setCount(count+1);
 
}
 return (
   <Grid container
   direction="row"
   justify="center"
   className={classes.root}>
     <Paper elevation={3}>
       <Grid>
       
       <Grid item> 
     <Typography className={classes.typography} align="center" gutterBottom variant="h5" component="h2">
                   Register
           </Typography>
           <Grid item container alignItems="center" className={classes.text}>
           <TextField
           inputProps={inputProps}
           value={userName}
   label="User Name"
   variant="outlined"
   color="primary"
   onChange={(e)=>{setUserName(e.target.value)}}
   required
 />
 </Grid>
     </Grid>
           <Grid item container alignItems="center" className={classes.text}>
           <TextField
           inputProps={inputProps}
           value={email}
   label="Email"
   variant="outlined"
   color="primary"
   onChange={(e)=>{setEmail(e.target.value)}}
   required
 />
 </Grid>
 <Grid item container alignItems="center" className={classes.text}>
           <TextField
           inputProps={inputProps}
           value={password}
   label="Password"
   type="password"
   variant="outlined"
   color="primary"
   onChange={(e)=>{setPassword(e.target.value)}}
   required
 />
 </Grid>
 <Grid item container alignItems="center" className={classes.text}>
           <TextField
           value={repeatPassword}
           inputProps={inputProps}
   label="Repeat Password"
   type="password"
   variant="outlined"
   color="primary"
   onChange={(e)=>{setRepeatPassword(e.target.value)}}
   required
 />
 </Grid>
 <Grid className={classes.alert}>
   {alertMeassage}
 </Grid>
 <Grid item container alignItems="center" className={classes.button}>
 <Button onClick={()=>{handleSubmit()}} variant="contained"size="medium" color="primary">
           Submit
         </Button>
 </Grid>
       </Grid>
       </Paper>
   </Grid>
 );
}
