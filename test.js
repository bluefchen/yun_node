var PythonShell = require('python-shell');
PythonShell.run('./controller/tes_args.py', {
    args: ['hello', 'world']
},function (err,res) {
    console.log(res);
    if (err) throw err;
    console.log('finished');
});