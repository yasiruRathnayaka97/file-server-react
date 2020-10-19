import {SIGNIN,SIGNOUT} from '../ActionTypes';
const initialState = {
     status:false,
     email:null,
     jwt:null
  };
  export default function(state = initialState, action) {
    switch (action.type) {
          case SIGNIN: { 
            return Object.assign({}, state,{
              status:true,
              email:action.payload.email,
              jwt:action.payload.jwt
            });
       
      }
      case SIGNOUT: { 
        return Object.assign({}, state,{
          status:false,
          email:null,
          jwt:null
        });
    }
      default:
        return state;
    }
  }
  
