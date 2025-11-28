import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8181',
    realm: 'bandit-games-realm',
    clientId: 'banditgames-platform',
});

export default keycloak;