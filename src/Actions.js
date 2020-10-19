import {FILE,SIGNIN,SIGNOUT} from './ActionTypes';
export const fileAction=(parent,type,pathList)=>({
        type:FILE,
        payload: {
          parent,
          type,
          pathList
        }
        
}
);

export const signInAction=(email,jwt)=>({
    
    type:SIGNIN,
    payload: {
      email,
      jwt
    }
    
}
);

export const signOutAction=()=>({
    type:SIGNOUT 
  }
  );
