import { useAutoLogout } from "../../hooks/UserLogout";


export const UserAutoLogout = () => {
    
  useAutoLogout(10); 
  return null;
};
