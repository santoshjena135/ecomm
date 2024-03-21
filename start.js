const { exec } = require('child_process');

exec('node app.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting Server 'app.js' : ${err}`);
        return;
    }
    console.log(stdout);
});

exec('node cart.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting Cart Service 'cart.js': ${err}`);
        return;
    }
    console.log(stdout);
});

exec('node dbroutes.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting DB-Routes Service 'dbroutes.js': ${err}`);
        return;
    }
    console.log(stdout);
});
