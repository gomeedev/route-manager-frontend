import { supabase } from "./supabaseClient";


const { data } = supabase.storage
  .from('interfaz')
  .getPublicUrl('logo.png');


export const logoUrl = data.publicUrl
