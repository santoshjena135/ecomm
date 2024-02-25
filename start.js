const { exec } = require('child_process');

exec('npx nodemon index.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting Server 'index.js' : ${err}`);
        return;
    }
    console.log(stdout);
});

exec('npx nodemon cart.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting Cart Service 'cart.js': ${err}`);
        return;
    }
    console.log(stdout);
});

exec('npx nodemon dbroutes.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting DB-Routes Service 'dbroutes.js': ${err}`);
        return;
    }
    console.log(stdout);
});
