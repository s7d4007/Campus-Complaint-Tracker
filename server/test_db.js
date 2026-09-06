const supabase = require('./src/config/supabase');
const test = async () => {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    console.log('Select Error:', error);
    const { data: iData, error: iError } = await supabase.from('users').insert({ name: 'Test', email: 'test1@test.com', password_hash: '123' });
    console.log('Insert Error:', iError);
};
test();
