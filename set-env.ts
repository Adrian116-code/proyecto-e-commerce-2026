const { writeFile } = require('fs');

const envConfigFile = `
export const environment = {
  production: true,
  supabaseUrl: '${process.env['supabaseUrl']}',
  supabaseKey: '${process.env['supabaseKey']}'
};
`;

writeFile('./src/environments/environment.ts', envConfigFile, (err) => {
  if (err) console.log(err);
});
