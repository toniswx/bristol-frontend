import * as dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://qhljimmosiizyuxvrrlp.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supaclient = createClient(supabaseUrl, supabaseKey);

export default supaclient;
