import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,  //navigate the URL from .env variables
  process.env.SUPABASE_KEY
);
