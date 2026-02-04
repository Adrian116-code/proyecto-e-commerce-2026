const { writeFile } = require('fs');
const envConfigFile = `
export const environment = {
  production: true,
  supabaseUrl: '${process.env['https://ghgpkpsbfimmpuxvkfqt.supabase.co']}',
  supabaseKey: '${process.env['sb_publishable_A2A1vOreY9nfUTbxK479bw_7wGCzIan']}'
};
`;
writeFile('./src/environments/environment.ts', envConfigFile, (err: any) => {
  if (err) console.log(err);
});
