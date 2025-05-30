import * as dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://qhljimmosiizyuxvrrlp.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const client = createClient(supabaseUrl, supabaseKey);

export default client;
