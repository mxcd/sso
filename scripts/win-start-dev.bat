mkcert localhost host.docker.internal
mkcert -install
node scripts/rp-conf.mjs
docker compose -f .\scripts\relying-party\docker-compose.yml up -d
docker logs -f relying-party_relying_party_1
docker compose -f .\scripts\relying-party\docker-compose.yml down
mkcert -uninstall
