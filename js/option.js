var OPT = {
    dev: window.location.hostname != 'matho.me',
    dev_port: ':8080',
    sketch_container: '#sketch',
    host: window.location.protocol + '//' + window.location.hostname,
    sketch_dir: '/sketch/',
    sketches: [
        'lorenz',
        'shoot',
        'chase'
    ]
}

if (OPT.dev) OPT.host = OPT.host + ':8080'
else OPT.host = OPT.host + '/p5js'
