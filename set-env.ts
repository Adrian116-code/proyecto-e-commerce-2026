const { writeFile } = require('fs');
const envConfigFile = `
export const environment = {
  production: true,
  supabaseUrl: '${process.env['sb_publishable_A2A1vOreY9nfUTbxK479bw_7wGCzIan']}',
  supabaseKey: '${process.env['https://ghgpkpsbfimmpuxvkfqt.supabase.co']}'
};
`;
writeFile('./src/environments/environment.ts', envConfigFile, (err: any) => {
  if (err) console.log(err);
});
