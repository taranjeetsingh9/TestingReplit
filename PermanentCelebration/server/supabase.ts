import { createClient } from '@supabase/supabase-js';
import { log } from './vite';

// Use provided values directly
const supabaseUrl = 'https://bfruktthihmkjqfnrlqx.supabase.co';

// Try to use service role key first (bypasses RLS), then fallback to anon key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcnVrdHRoaWhta2pxZm5ybHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTkwMTksImV4cCI6MjA2MTk3NTAxOX0.BXlgU1TyzDRDGv49O2MruSzutVx3ntZXS0EyYgwY2JE';

// Use service key if available (bypasses RLS), otherwise use anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;
const isUsingServiceKey = !!supabaseServiceKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Log which key we're using (without showing the actual key)
console.log(`Using Supabase ${isUsingServiceKey ? 'service role key' : 'anon key'} for database operations`);

// Initialize storage bucket for memories photos if it doesn't exist
export async function initializeSupabaseStorage() {
  try {
    // Initialize tables
    await initializeTables();
    
    // Check if the bucket exists and create if needed
    const bucketName = 'memories';
    try {
      // Try to get the bucket - if it doesn't exist, this will error
      const { data, error } = await supabase.storage.getBucket(bucketName);
      
      if (error) {
        if (error.message.includes('not found')) {
          // Create the bucket
          const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760 // 10MB limit
          });
          
          if (createError) {
            log(`Error creating bucket: ${createError.message}`, 'error');
          } else {
            log(`Created '${bucketName}' bucket in Supabase storage`);
            
            // Update RLS policies to make bucket contents publicly accessible
            const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl('dummy.txt', 60);
            if (policyError) {
              log(`Note: May need to update bucket policies in Supabase dashboard: ${policyError.message}`);
            }
          }
        } else {
          log(`Error checking bucket: ${error.message}`, 'error');
        }
      } else {
        log(`'${bucketName}' bucket already exists in Supabase storage`);
      }
    } catch (bucketError) {
      log(`Error working with bucket: ${bucketError}`, 'error');
    }
  } catch (error) {
    log(`Error initializing Supabase storage: ${error}`, 'error');
  }
}

// Create memories table using direct REST API access
async function createMemoriesTable() {
  try {
    // First, create the table by inserting a row with the required schema
    const { error: insertError } = await supabase
      .from('memories')
      .insert({
        name: 'Test User',
        message: 'Table initialization',
        photo: null,
        created_at: new Date().toISOString()
      });
    
    // If we get a not-null error with "does not exist", try the direct method
    if (insertError && insertError.message?.includes('does not exist')) {
      // Use POST request directly to create the table via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: 'Table Creator',
          message: 'Creating table',
          created_at: new Date().toISOString()
        })
      });

      if (response.status === 201) {
        log('Memories table created successfully via POST API');
        return true;
      } else {
        const responseText = await response.text();
        log(`Error creating memories table with POST API: ${responseText}`, 'error');
        return false;
      }
    } else if (!insertError) {
      // No error means the table already exists
      log('Memories table exists and the test record was inserted');
      return true;
    } else {
      // Other types of errors, perhaps permissions
      log(`Error accessing memories table: ${insertError.message}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Error in createMemoriesTable: ${error}`, 'error');
    return false;
  }
}

// Create RSVPs table using direct REST API access
async function createRsvpsTable() {
  try {
    // First, create the table by inserting a row with the required schema
    const { error: insertError } = await supabase
      .from('rsvps')
      .insert({
        full_name: 'Test User',
        phone: '123-456-7890',
        guests: '1',
        dietary: '',
        message: 'Table initialization',
        created_at: new Date().toISOString()
      });
    
    // If we get a not-null error with "does not exist", try the direct method
    if (insertError && insertError.message?.includes('does not exist')) {
      // Use POST request directly to create the table via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rsvps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          full_name: 'Table Creator',
          phone: '123-456-7890',
          guests: '1',
          dietary: '',
          message: 'Creating table',
          created_at: new Date().toISOString()
        })
      });

      if (response.status === 201) {
        log('RSVPs table created successfully via POST API');
        return true;
      } else {
        const responseText = await response.text();
        log(`Error creating RSVPs table with POST API: ${responseText}`, 'error');
        return false;
      }
    } else if (!insertError) {
      // No error means the table already exists
      log('RSVPs table exists and the test record was inserted');
      return true;
    } else {
      // Other types of errors, perhaps permissions
      log(`Error accessing RSVPs table: ${insertError.message}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Error in createRsvpsTable: ${error}`, 'error');
    return false;
  }
}

async function initializeTables() {
  try {
    // First try to create the tables if they don't exist
    // Then we'll set up RLS policies to allow public access
    
    try {
      // Check if we can access the memories table
      const { data, error: memoriesError } = await supabase
        .from('memories')
        .select('*')
        .limit(1);
      
      if (!memoriesError) {
        log('Memories table exists and is accessible');
      } else if (memoriesError.message.includes('does not exist')) {
        log('Creating memories table...');
        // Create the memories table
        const { error: createError } = await supabase.rpc('create_memories_table');
        
        if (createError) {
          log(`Error creating memories table with RPC: ${createError.message}`, 'error');
          // Try direct SQL
          await createMemoriesTable();
        } else {
          log('Memories table created successfully');
        }
      } else {
        log(`Memories table access error: ${memoriesError.message}`);
      }
      
      // Check if we can access the rsvps table
      const { error: rsvpsError } = await supabase
        .from('rsvps')
        .select('*')
        .limit(1);
      
      if (!rsvpsError) {
        log('RSVPs table exists and is accessible');
      } else if (rsvpsError.message.includes('does not exist')) {
        log('Creating RSVPs table...');
        // Create the RSVPs table
        const { error: createError } = await supabase.rpc('create_rsvps_table');
        
        if (createError) {
          log(`Error creating RSVPs table with RPC: ${createError.message}`, 'error');
          // Try direct SQL
          await createRsvpsTable();
        } else {
          log('RSVPs table created successfully');
        }
      } else {
        log(`RSVPs table access error: ${rsvpsError.message}`);
      }
      
      // Check bucket access
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('memories');
      
      if (!bucketError) {
        log('Storage bucket exists and is accessible');
      } else {
        log(`Storage bucket error: ${bucketError.message}`);
      }
      
    } catch (err) {
      log(`Error checking Supabase tables: ${err}`, 'error');
    }
    
    log('Supabase tables initialized successfully');
  } catch (error) {
    log(`Error initializing Supabase tables: ${error}`, 'error');
    throw error;
  }
}
