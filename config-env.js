const fs = require('fs');
const path = require('path');

// Definimos la ruta donde Angular espera encontrar el archivo
const dir = './src/environments';
const targetPath = path.join(dir, 'environment.ts');

// Si no existe la carpeta, la creamos
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Contenido del archivo usando las variables que pondremos en Cloudflare
// Recordamos que el URL es string
const envConfigFile = `
export const environment = {
  production: true,
  supabaseUrl: '${process.env.supabaseUrl || ""}',
  supabaseKey: '${process.env.supabaseKey || ""}'
};
`;

console.log('Generando archivo de entorno en: ' + targetPath);

fs.writeFileSync(targetPath, envConfigFile, 'utf8');
