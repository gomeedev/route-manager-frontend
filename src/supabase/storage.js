import { supabase } from "./supabaseClient";


const { data:logoData } = supabase.storage
  .from('interfaz')
  .getPublicUrl('logo.png');

const { data:logoResponsive } = supabase.storage
  .from('interfaz')
  .getPublicUrl('logo_responsive.png');


  
export const logoUrl = logoData.publicUrl
export const iconUrl = logoResponsive.publicUrl

