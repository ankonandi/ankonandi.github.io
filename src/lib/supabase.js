import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config.js'

export const adminEnabled = Boolean(supabaseConfig.url && supabaseConfig.publishableKey)

export const supabase = adminEnabled
  ? createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null
