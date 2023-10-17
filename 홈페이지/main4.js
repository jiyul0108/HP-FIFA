const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJYLUFwcC1SYXRlLUxpbWl0IjoiNTAwOjEwIiwiYWNjb3VudF9pZCI6IjE2NjE2NDE4ODciLCJhdXRoX2lkIjoiMiIsImV4cCI6MTcxMjU2NDU5NiwiaWF0IjoxNjk3MDEyNTk2LCJuYmYiOjE2OTcwMTI1OTYsInNlcnZpY2VfaWQiOiI0MzAwMTE0ODEiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4ifQ.uZHyGkNLHrjgRsTZmOqAOgZ9mEtYEPyL8OUkBXIKrAg';
const tradeType = 'buy';
const limit = 10;

const apiUrl = (path) => `https://public.api.nexon.com/openapi/fconline/v1.0/${path}`;

const fetchJson = (url) => fetch(url, { headers: { 'Authorization': apiKey } }).then(response => response.json());

const getPlayerInfo = (playerID, spidData, seasonData) => {
    const playerInfo = [];
    const playerSeason = parseInt(String(playerID).slice(0, 3));

    const seasonInfo = seasonData.find(info => info.seasonId === playerSeason);
    playerInfo.push(seasonInfo ? seasonInfo.className : 'Unknown Season');

    const playerInfoData = spidData.find(info => info.id === playerID);
    playerInfo.push(playerInfoData ? playerInfoData.name : 'Unknown Player');

    return playerInfo;
};

const getUserId = (nickname) => fetchJson(apiUrl(`users?nickname=${nickname}`)).then(userInfo => userInfo.accessId);

const getMarketInfo = (userAccessId, number, spidData, seasonData) => {
    const url = apiUrl(`users/${userAccessId}/markets?tradetype=${tradeType}&offset=0&limit=${number}`);
    return fetchJson(url).then(transInfo => {
        return transInfo.map(info => {
            const playerInfo = getPlayerInfo(info.spid, spidData, seasonData);
            return {
                "구매 날짜": info.tradeDate.replace("T", " "),
                "구매 선수": `${playerInfo[0]} ${playerInfo[1]}`,
                "강화 단계": info.grade,
                "가격": new Intl.NumberFormat().format(info.value)
            };
        });
    });
};

const displayOnHTML = (result) => {
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = '';

    let count = 1;

    for (const info of result) {
        const transactionDiv = document.createElement('div');

        const pElementCount = document.createElement('p');
        pElementCount.textContent = count;
        transactionDiv.appendChild(pElementCount);

        for (const [k, v] of Object.entries(info)) {
            const pElement = document.createElement('p');
            pElement.textContent = `${k}: ${v}`;
            transactionDiv.appendChild(pElement);
        }

        outputElement.appendChild(transactionDiv);
        count++;
    }
};

const loadMarketInfo = () => {
    const nickname = document.getElementById('nickname').value;
    const number = document.getElementById('number').value;

    getUserId(nickname)
        .then(userAccessId => getMarketInfo(userAccessId, number, [], [])) // spidData와 seasonData를 불러오는 부분이 필요함
        .then(transInfo => displayOnHTML(transInfo))
        .catch(error => console.error('Error:', error));
};

document.getElementById('searchButton').addEventListener('click', loadMarketInfo);
