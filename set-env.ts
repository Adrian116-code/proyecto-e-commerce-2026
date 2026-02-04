const { writeFile } = require('fs');
const path = require('path');

// Esta ruta debe coincidir con la que busca tu Angular (vimos que era src/environments/environment.ts)
const targetPath = './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
  production: true,
  supabaseUrl: '${process.env['sb_publishable_A2A1vOreY9nfUTbxK479bw_7wGCzIan']}',
  supabaseKey: '${process.env['https://ghgpkpsbfimmpuxvkfqt.supabase.co']}'
};
`;

writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Archivo de entorno generado en ${targetPath}`);
  }
});
