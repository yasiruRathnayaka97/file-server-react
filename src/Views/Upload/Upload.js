import React,{useEffect,useState} from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { fileAction } from "../../Actions";
import { useDispatch, useSelector } from 'react-redux';
import SignIn from '../Sign/SignIn';
require('dotenv').config();
const base=process.env.REACT_APP_REST_API_BASE;
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(12),
        width: theme.spacing(40),
        height: theme.spacing(30),
      },
    },
    text:{
      paddingLeft:theme.spacing(6),
      paddingRight:theme.spacing(6),
      paddingTop:30
    },
    button:{
      paddingLeft:theme.spacing(11),
      paddingRight:theme.spacing(11),
      paddingTop:10,
   
    },
    typography:{
      paddingTop:10
   
    },
    input: {
      display: 'none',
    },
  }));
export default function Upload() {
    var file = useSelector(state => state.fileReducer);
    var sign = useSelector(state => state.signReducer);
    const inputProps={
        maxLength: 24
      }
const classes = useStyles();   
const [childName, setChildName] = useState('');
const [count, setCount] = useState(0);
const [files, setFiles] = useState([]);
var history = useHistory()
var dispatch=useDispatch();
const handleFileChange=(files)=>{
    setFiles(files);
    setCount(count+1);
}
const handleSubmit=()=>{
  setCount(count+1);
}
const fetchData = async() => {  
  if(file.type==='folder'){
    axios.post(base+'/file/create', {
      parent:file.parent,
      childName:childName
    },{headers: {
      'Authorization': sign.jwt
    }})
    .then(res=>{
     dispatch(fileAction(file.parent,' ',file.pathList))
     console.log(res.data.status);
     } 
  ).catch(function (error) {
      console.log(error);
    });
  }
 else{
  var formData= new FormData();
  formData.append('file',files[0]);
  formData.append('parent',file.parent);
  formData.append('childName',childName);
  axios.post(base+'/file/upload', 
    formData,
    {headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(res=>{
   dispatch(fileAction(file.parent,'folder',file.pathList))
   console.log(res.data.status);
   } 
).catch(function (error) {
    console.log(error);
  });
 }
 history.push('/files')
}

  useEffect(()=>{
    if(count>0){
      fetchData();
    }
},[count])

function submitButton(type){
  if(type==="file"){
    return(
      <Grid><input
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={(e)=>{handleFileChange(e.target.files)}}
      />
      <label htmlFor="contained-button-file">
      <Button ariant="contained"size="medium" color="primary" component="span" >{file.type==='file'?'Upload File':'Create Folder'}</Button>
      </label>
      </Grid>)
  }
  else{
    return(
      <Grid>
      <Button ariant="contained"size="medium" color="primary"  onClick={()=>{handleSubmit()}} >{file.type==='file'?'Upload File':'Create Folder'}</Button>
      </Grid>)
  }
  
}
if(sign.status){


return(
    <Grid container
    direction="row"
    justify="center"
    className={classes.root}>
      <Paper elevation={3}>
        <Grid>
        <form>
        <Grid item> 
      <Typography className={classes.typography} align="center" gutterBottom variant="h5" component="h2">
                   {file.type==='file'?'Upload':'Create'}
            </Typography>
      </Grid>
            <Grid item alignItems="center" className={classes.text}>
            <TextField 
     inputProps={inputProps}
   value={childName}
    label={file.type==='file'?'File Name':'Folder Name'}
    variant="outlined"
    color="primary"
    onChange={(e)=>{setChildName(e.target.value)}}
    required
  />
  </Grid>
  
  <Grid item alignItems="center" className={classes.button}>
  {submitButton(file.type)}
  </Grid>
            </form>
        </Grid>
        </Paper>
    </Grid>


)
}
else{
 history.push('/login')
 return(<SignIn/>)
}
}