import { combineReducers } from "redux";
import settings from "./settings/Reducer";
import userPermissions from "./userPermissions/Reducer";
const Reducers = combineReducers({
  settings,
  userPermissions,
});

export default Reducers;
