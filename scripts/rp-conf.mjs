import {loadEnv} from "./util.mjs";
import {readFileSync, writeFileSync} from 'fs'
import {exec} from 'child_process'
import {join} from 'path'
const WINDOWS = process.platform === "win32";

async function getOwnIpAddress() {
  return new Promise((resolve, reject) => {
    if(WINDOWS) {
	  console.log(`resolving own IP for Windoof`);
      const ipAddressProcess = exec("ipconfig", (error, stdout, stderr) => {
        if (error) {
		  console.log(error)
          reject(error)
        }
        const IP_REGEX = /IPv4.*?(\d\d?\d?.\d\d?\d?.\d\d?\d?.\d\d?\d?)/gm
        let ipMatch = IP_REGEX.exec(stdout.trim())
        if(ipMatch) {
          resolve(ipMatch[1])
        }
        else {
          reject();
        }
      });
    }
    else {
      const ipAddressProcess = exec("hostname -I | cut -d' ' -f1", function (error, stdout, stderr) {
        if (error) {
          reject(error)
        }
        resolve(stdout.trim())
      });
    }
  })
}

(async () => {
  loadEnv();
  let oidcConfData = readFileSync('./scripts/relying-party/oidc.conf.template', 'utf8');
  writeFileSync('./scripts/relying-party/oidc.conf', oidcConfData, 'utf8');

  let dockerComposeData = readFileSync('./scripts/relying-party/docker-compose.yml.template', 'utf8');
  dockerComposeData = dockerComposeData.replace(/{{HTDOCS_PATH}}/g, join(process.cwd(), 'scripts/relying-party/htdocs'));
  dockerComposeData = dockerComposeData.replace(/{{OIDC_CONF_PATH}}/g, join(process.cwd(), 'scripts/relying-party/oidc.conf'));
  dockerComposeData = dockerComposeData.replace(/{{DOCKERFILE_PATH}}/g, join(process.cwd(), 'scripts/relying-party'));
  dockerComposeData = dockerComposeData.replace(/{{SSL_KEY_PATH}}/g, join(process.cwd(), 'localhost+1-key.pem'));
  dockerComposeData = dockerComposeData.replace(/{{SSL_CERT_PATH}}/g, join(process.cwd(), 'localhost+1.pem'));
  dockerComposeData = dockerComposeData.replace(/\\/g, '/');
  writeFileSync('./scripts/relying-party/docker-compose.yml', dockerComposeData, 'utf8');
})()
