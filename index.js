const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const url = 'https://auth.riotgames.com/api/v1/authorization'
const AuthCookiesBody = {
    client_id: "play-valorant-web-prod",
    nonce: "1",
    redirect_uri: "https://playvalorant.com/opt_in",
    response_type: "token id_token",
    scope: "account openid"
};
const AuthRequestBody = {
    type: "auth",
    username: "userid",
    password: "password",
    remember: "true",
    language: "en_US"
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(AuthCookiesBody)
})
.then(response => {
    const cookie = response.headers.get('Set-Cookie');
    const tdid = cookie.match(/tdid=(.*?);/)[1]
    const asid = cookie.match(/asid=(.*?);/)[1]
    const clid = cookie.match(/clid=(.*?);/)[1]
    const __cf_bm = cookie.match(/__cf_bm=(.*?);/)[1]
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `tdid=${tdid}; asid=${asid}; clid=${clid}; __cf_bm=${__cf_bm}`
        },
        credentials: 'include',
        body: JSON.stringify(AuthRequestBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.type && data.type.startsWith('multifactor')){
            rl.question('Enter code: ', (code) => {
                const FactorAuthenticationBody = {
                    type: "multifactor",
                    code: code,
                    rememberDevice: "true"
                }
                fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(FactorAuthenticationBody)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
                rl.close();
            });
        }
    })
})