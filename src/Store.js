import { createStore,combineReducers } from "redux";
import fileReducer from "./Reducers/FileReducer";
import signReducer from "./Reducers/SignReducer";
const rootReducer=combineReducers({fileReducer,signReducer});
export default createStore(rootReducer);