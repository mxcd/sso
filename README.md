#SSO Service
**S**ingle**S**ign**O**n

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
Navigate to `./example/relying-party` and start it using `docker-compose`:  
```
cd ./example/relying-party
docker-compose up
```
This will build the relying party image based on `httpd` and start it up using the just created certificate  
The RP will be accessible through [`https://localhost:8080`](https://localhost:8080) unless configured otherwise
