import Button from '@material-ui/core/Button';
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {  makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { signOutAction} from "../Actions";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'block',
  },
  
}));

export default function SearchAppBar() {
  const classes = useStyles();
  var history = useHistory();
  var dispatch=useDispatch();
  var sign = useSelector(state => state.signReducer);
  var bar=[{ref:'/Login',text:"Login"},{ref:'/Register',text:"Register"}]
  if(sign.status){
    bar=[{ref:'/Login',text:"LogOut"}]
  }
  const action=(ref,text)=>{
    window.sessionStorage.setItem("jwt",null);
    if(text==='LogOut'){
      dispatch(signOutAction())
    }
    history.push(ref);
    
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            FILE SERVER
          </Typography>
          <div >
    {bar.map((json, index) => (
        <Button key={index} onClick={()=>{action(json.ref,json.text)}}  color="inherit"  >{json.text}</Button>
      ))}
    </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
