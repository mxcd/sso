import {existsSync, readFileSync} from "fs";

const ENV_REGEX = /^(\w+?)\s*=\s*"?(.+)"?\r?\n?/gm

export function loadEnv() {
  let envObject = {};
  if(existsSync('.env')) {
    const env = readFileSync('.env', 'utf8');
    let envMatch;
    do {
      envMatch = ENV_REGEX.exec(env)
      if(envMatch) {
        console.log(`loaded ${envMatch[1]} from .env`)
        envObject[envMatch[1]] = envMatch[2]
      }
    } while(envMatch)
  }
  Object.assign(process.env, envObject)
  return envObject;
}
