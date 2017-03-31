var OPT = {
  dev: false,
  dev_port: ':8080',
  sketch_container: '#sketch',
  host: window.location.protocol + '//' + window.location.hostname,
  sketch_dir: '/sketch/',
  sketches: [
    'lorenz',
    'shoot',
    'test'
  ]
}

if (OPT.dev) OPT.host = OPT.host + ':8080'
else OPT.host = OPT.host + '/p5js'
