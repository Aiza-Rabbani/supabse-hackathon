import { createClient } from 'https://esm.sh/@supabase/supabase-js'



const supUrl = 'https://bidzykegdiqvhzutoigr.supabase.co'
const supKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZHp5a2VnZGlxdmh6dXRvaWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDA5OTksImV4cCI6MjA4Mjg3Njk5OX0.5-Jq68nqPNBb_xAizB2A2sYXsByV-lbb6yPbToSNLko'

const supabase = createClient(supUrl, supKey)
console.log(supabase);

export default supabase;
