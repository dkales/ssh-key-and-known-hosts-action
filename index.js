const core = require('@actions/core')
const execa = require('execa')
const promise = require('bluebird')
const fs = promise.promisifyAll(require('fs'))

async function run() {
  try {
    const privateKey  = core.getInput('ssh-private-key', { required: true })
    const host        = core.getInput('ssh-host', { required: true })
    const authSock    = core.getInput('ssh-socket')
    const port        = core.getInput('ssh-port')
    const known_hosts = core.getInput('known-host-entry', { required: true })

    // Create the required directory
    const sshDir = process.env['HOME'] + '/.ssh'
    await fs.mkdirAsync(sshDir, {recursive: true})

    console.log('Starting ssh-agent')

    // Start the ssh agent
    await execa('ssh-agent', ['-a', authSock])

    core.exportVariable('SSH_AUTH_SOCK', authSock)

    console.log('Adding private key')

    // Add the private key
    const key = privateKey.replace('/\r/g', '').trim() + '\n'
    await execa('ssh-add', ['-'], {input: key})

    console.log('Adding host to known_hosts')

    // Add the host to the known_hosts file
    const knownHostsFile = sshDir + '/known_hosts'

    const name = "[" + host + "]:" + port;

    const {code}       = await execa('ssh-keygen', ['-F', name])
    if (code != 0)
    {
      await fs.appendFileAsync(knownHostsFile, "\n" + known_hosts + "\n")
    }
    await fs.chmodAsync(knownHostsFile, '644')
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
