import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjtuhmzjurcsdzubczfw.supabase.co';
const supabaseAnonKey = 'sb_publishable_HxlQUAgznKSS3fvlbKwRjQ_QrAEUu-j';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogins() {
    const emails = ['participante@topshape.com', 'participante_nuevo@topshape.com'];
    const password = 'Password123';

    for (const email of emails) {
        console.log(`Checking login for ${email}...`);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            console.error(`  Failed: ${error.message}`);
        } else {
            console.log(`  Success! User ID: ${data.user?.id}`);
            console.log("  Session details:", data.session ? "Present" : "Missing");
        }
    }
}

testLogins();
