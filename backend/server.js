// Importer les modules
const http = require('http');
//const https = require('https');
const app = require('./app');
//const path = require('path');
//const fs = require('fs');




/**
 * Normalisation du port
 * @param {int} val 
 * @returns {int} le port normalisé
 */
const normalizePort = val =>{
    const port = parseInt(val,10);

    if(isNaN(port)){
        return val;
    }
    if(port >= 0){
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

/**
 * Rerchercher les erreurs
 * @param {*} error 
 */
const errorHandler = error =>{
    if(error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    switch(error.code){
        case  'EACCES':
            console.error(bind + 'requires elevated priviliges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + 'is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/* On récupère notre clé privée et notre certificat (ici ils se trouvent dans le dossier certificate) */
/*const key = fs.readFileSync(path.join(__dirname, 'certificate', 'server.key'));
const cert = fs.readFileSync(path.join(__dirname, 'certificate', 'server.cert'));
 
const options = { key, cert };*/

const server = http.createServer(app);
//const servers = https.createServer(options, app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Linstening on ' + bind);
});

/*servers.on('error', errorHandler);
servers.on('listening', ()=>{
    const address = servers.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Linstening on ' + bind);
});*/

server.listen(port);
//servers.listen(port);