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

    toast.info("Sesión cerrada por inactividad", {duration: 20000})
    navigate("/signin");
  };


  const resetTimer = () => {
    // Verificar nuevamente en cada reset por si el usuario cerró sesión
    const token = localStorage.getItem("token");
    if (!token) return;

    if (localStorage.getItem("keepConnected") === "true") {
        return;  
    } 

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      logout();
    }, minutes * 60 * 1000);
  };


  useEffect(() => {
    // Solo activar si hay token (usuario autenticado)
    const token = localStorage.getItem("token");
    
    if (!token) {
      return; // No hacer nada si no hay sesión activa
    }

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();


    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // Se ejecuta solo una vez al montar
  
  return null;
};
