import React, { useEffect,useState }from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fileAction } from "../../Actions";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import { IconButton, Grid } from '@material-ui/core';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import CreateNewFolderRoundedIcon from '@material-ui/icons/CreateNewFolderRounded';
import FolderOpenRoundedIcon from '@material-ui/icons/FolderOpenRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import moment from 'moment';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

import { saveAs } from 'file-saver';
import SignIn from '../Sign/SignIn';
require('dotenv').config();
const base=process.env.REACT_APP_REST_API_BASE;
const axios = require('axios');

const useStylesBreadCrumbs = makeStyles((theme) => ({
  breadcrumbs:{
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    
  },
}));
function CollapsedBreadcrumbs() {
  var dispatch=useDispatch();
  var file = useSelector(state => state.fileReducer);
  const classes = useStylesBreadCrumbs();
  function handleClick(index) {
    
    dispatch(fileAction(file.pathList.slice(index-1,index)[0].child,'',file.pathList.slice(0,index)))
    
  }
   
  return (
   <Grid 
   container 
  direction="row"
  justify="center"
   className={classes.breadcrumbs}>
       <Breadcrumbs 
        maxItems={2} aria-label="breadcrumb">
    {file.pathList.map((json, index) => (
      <Link key={index} color="inherit"  href="#" onClick={()=>{handleClick(index)}}>
        {json.childName}
      </Link>
    ))}
      </Breadcrumbs>
      </Grid>
    
  );
}
const useDrawerStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

function SwipeableTemporaryDrawer(props) {
  var { type,child,childName} = props;
  var history = useHistory()
  const folderIcons=[<CreateNewFolderRoundedIcon/>,<DeleteForeverRoundedIcon/>,<FolderOpenRoundedIcon/>,<PublishRoundedIcon/>]
  const fileIcons=[<GetAppRoundedIcon/>,<DeleteForeverRoundedIcon/>]
  var Icons=folderIcons;
  const folderOperations=['Create', 'Delete', 'Open','Upload'];
  const fileOperations=['Download','Delete'];
  var operationType= "Folder Operations";
  var operations= folderOperations;
  var [download,setDownload]=useState('');
  var [del,setDel]=useState('');
  var [t,setT]=useState('');
  var [name,setName]=useState('');
  var file = useSelector(state => state.fileReducer);
  var sign = useSelector(state => state.signReducer);
  var dispatch=useDispatch();
  const [count,setCount]=useState(0);
  const fetchDataDownload = async() => {  
    axios.post(base+'/file/download', {
      fileID:download,
    },{headers: {
      'Authorization': sign.jwt
    }})
    .then(res=>{
      const blob=new Blob([res.data.data],{type:res.headers['content-type']});
      saveAs(blob,name+res.data.extension);
     } 
  ).catch(function (error) {
      console.log(error);
    });
   
  }
  const fetchDataDelete = async() => {
    axios.post(base+'/file/delete', {
      fileID:del,
      type:t,
    },{headers: {
      'Authorization': sign.jwt
    }})
    .then(res=>{
      console.log(res.data.status);
      if(res.data.status!=='Success'){
        alert(res.data.status)
      }
        
     } 
  ).catch(function (error) {
      console.log(error);
    });
   
  }
 
    useEffect(()=>{
      if(count>0){
        if(download!==''){
          fetchDataDownload();
          setDownload('');
        }
        else{
          fetchDataDelete();
          setDel('');
          dispatch(fileAction(file.parent,'',file.pathList))
        }
      }
     
  },[count])

  if(type==="File"){
    operations=fileOperations;
    operationType="File Operations";
    Icons=fileIcons;
}

  const classes = useDrawerStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const handleClick=(operation)=>{
  if(type==='Folder'){
    if(operation==="Upload"){
      file.pathList.push({'child':child,'childName':childName})
      dispatch(fileAction(child,"file",file.pathList))
      history.push('/upload')
    }
    else if(operation==="Open"){
        file.pathList.push({'child':child,'childName':childName})
        dispatch(fileAction(child,"",file.pathList))
      }
     else if(operation==="Create"){
        file.pathList.push({'child':child,'childName':childName})
        dispatch(fileAction(child,"folder",file.pathList))
        history.push('/upload')
      }
    else{
      setDel(child);
      setT('folder');
      setCount(count+1);
      
    }
    }
      else {
        if(operation==="Download"){
          setDownload(child);
          setName(childName);
          setCount(count+1);
        }
        else{
          setDel(child);
          setT('file');
          setCount(count+1);
        }
      }
 
    
  }
  const toggleDrawer = (anchor, open) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
       <Typography variant="h6"  align="center" color="primary">
       {operationType}
       </Typography>
       
    
      <Divider/>
      <List>
        {operations.map((text, index) => (
          <ListItem button key={text} onClick={()=>{handleClick(text)}}>
            <ListItemIcon>{Icons[index]}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (

    <div>
      {[ 'right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)} color="primary" aria-label="Action picture" component="span">
          <OpenInNewRoundedIcon />
        </IconButton>
          
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  paper:{
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(10),
     
    }
    
  }
}));


function BasicTable(props) {
  const { rows } = props;
  const classes = useStyles();

  return (
    <Grid className={classes.paper}>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell ><Typography variant="h6" component="h6">
            Name
</Typography></TableCell>
            <TableCell align="right"><Typography variant="h6" component="h6">Date</Typography></TableCell>
            <TableCell align="right"><Typography variant="h6" component="h6">Time</Typography></TableCell>
            <TableCell align="right"><Typography variant="h6" component="h6">Operations</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.child}>
              <TableCell component="th" scope="row">
                {row.childName}
              </TableCell>
              <TableCell align="right">{moment(row.uploadDate).format("DD:MM:YYYY")}</TableCell>
              <TableCell align="right">{moment(row.uploadDate).format("hh:mm:ss")}</TableCell>
              <TableCell align="right">{<SwipeableTemporaryDrawer child={row.child} childName={row.childName} type={row.type}/>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CollapsedBreadcrumbs/>
    </TableContainer>
    </Grid>
  );
  
}

export default function Files(){
  var file = useSelector(state => state.fileReducer);
  var sign = useSelector(state => state.signReducer);
  var history = useHistory()
  const [rows,setRows]=useState([]);
  const fetchData = async() => {  
    axios.post(base+'/file/view', {
      parent:file.parent
    },{headers: {
      'Authorization': sign.jwt
    }})
    .then(res=>{
     setRows(res.data.files);
     } 
  ).catch(function (error) {
      console.log(error);
    });
   
  }
 
    useEffect(()=>{
     fetchData();
  },[file.parent,file.type])
if(sign.status){
  return (
    <Grid>
    <BasicTable rows={rows||[]}/>
    </Grid>
  )
}
else{
  history.push('/login')
  return(<SignIn/>)
}

}
