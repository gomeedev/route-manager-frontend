import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { supabase } from "../global/supabase/supabaseClient";




export const useAutoLogout = (minutes = 10) => {

  const navigate = useNavigate();
  const timeoutRef = useRef(null);


  const logout = async () => {

    await supabase.auth.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");

    toast.info("Sesión cerrada por inactividad", {duration: 2000})
    navigate("/signin");
  };


  const resetTimer = () => {

    // Valido como string porque localStorage guarda strings y no booleanos
    if (localStorage.getItem("keepConnected") === "true") {
        return;  
    } 

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      logout();
    }, minutes * 60 * 1000);
  };


  useEffect(() => {

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {

      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );

      clearTimeout(timeoutRef.current);

    };
  }, []);
  

  return null;
};
