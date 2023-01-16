const execa = require('execa')
const core = require('@actions/core')

async function run() {
  console.log('Stopping ssh-agent')

    try {
      await execa('kill -9 $(ps -e | grep -m1 "[s]sh-agent" | awk \'{print $1}\')', { shell: true });
    }
    catch (error) 
    {
      console.log(error)
    }

    const authSock    = core.getInput('ssh-socket')
    try {
      await execa('rm', [authSock], { shell: true });
    }
    catch (error) 
    {
      console.log(error)
    }
}

run()
