# SSO Service
#### **S**ingle**S**ign**O**n 
A SingeSignOn service provider using an OpenID Connect Server as **OP**  


## Prerequisites

### Node.js
Node.js version 14 or higher is required

### Docker
Docker and docker-compose is required to start the RelyingParty (**RP**) on your local machine.
Please refer to the official documentation of [Docker Desktop](https://docs.docker.com/desktop/),
the [Docker Engine](https://docs.docker.com/engine/install) and [Docker Compose](https://docs.docker.com/compose/install/) for detailed instructions.

### mkcert
A local SSL certificate is required in order to do proper SSL termination in the RP apache server.
An easy way to achieve this is to use `mkcert`, a tool that generates a CA for you, installs it and generates SSL certs
for the RP server.
Please refer to the [mkcert GitHub page](https://github.com/FiloSottile/mkcert) for installation instructions.
**Caution:**
If running on windows (even when using WSL), make sure to install and execute mkcert in your windows environment and not the WSL.
Your browser opens in windows and accesses the windows truststore to check for the generated root CA.

## Project setup

### Node Packages
To install the required dependencies, run
```bash
npm i
```

### .env file
To get started, copy the `.env_template` file to `.env` of the project root and fill in the `CLIENT_ID` and `CLIENT_SECRET`
for the OIDC RP.

### Root CA and certificates
**NOTE:** This step is done automatically when using the `start-dev` script

Generate a root CA and matching certificates.
```bash
mkcert localhost
```
Then, add the root CA to your system's truststore with
```bash
mkcert -install
```

## Running the example
A simple example is ready to be started
#### Create your local SSL cert with `mkcert`  
Download or install `mkcert` as instructed [here](https://github.com/FiloSottile/mkcert)  
Run  
```
mkcert --install localhost host.docker.internal
```  
This will create a certificate and a private key for your local SSL connection and install them in your system truststore.
`host.docker.internal` is the domain that is being used by the relying party container to address the SSO running on your local machine in DEV mode
#### Build and run the RP 
```
./scripts/win-start-dev.bat
```
This will build the relying party image based on `httpd` and start it up using the just created certificate  
The RP will be accessible through [`https://localhost:8000`](https://localhost:8080) unless configured otherwise
