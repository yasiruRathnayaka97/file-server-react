import {FILE} from '../ActionTypes';
const initialState = {
    parent:"",
    type:"",
    pathList:[]
  };
  export default function(state = initialState, action) {
    switch (action.type) {
          case FILE: { 
            return Object.assign({}, state,{
              parent:action.payload.parent,
              type:action.payload.type,
              pathList:action.payload.pathList
            });
       
      }
      default:
        return state;
    }
  }