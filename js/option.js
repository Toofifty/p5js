var OPT = {
  dev: true,
  dev_port: ':8080',
  sketch_container: '#sketch',
  host: window.location.protocol + '//' + window.location.hostname,
  sketch_dir: '/sketch/',
  sketches: [
    'dummy',
    'lorenz',
    'test'
  ]
}

if (true) OPT.host = OPT.host + ':8080'
