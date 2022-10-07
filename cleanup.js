const execa = require('execa')

async function run() {
  console.log('Stopping ssh-agent')

  await execa('kill -15 $(pidof ssh-agent)', { shell: true });
}

run()
