const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJYLUFwcC1SYXRlLUxpbWl0IjoiNTAwOjEwIiwiYWNjb3VudF9pZCI6IjE2NjE2NDE4ODciLCJhdXRoX2lkIjoiMiIsImV4cCI6MTcxMjU2NDU5NiwiaWF0IjoxNjk3MDEyNTk2LCJuYmYiOjE2OTcwMTI1OTYsInNlcnZpY2VfaWQiOiI0MzAwMTE0ODEiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4ifQ.uZHyGkNLHrjgRsTZmOqAOgZ9mEtYEPyL8OUkBXIKrAg';  // 여러분의 API 키
const tradetype = 'buy'; // 거래 유형 ('buy' 또는 'sell')
const limit = 10; // 가져올 개수 (기본값: 10)

// (1) 선수 고유식별자 metadata 불러오기
const spidMetadataUrl = 'https://static.api.nexon.co.kr/fconline/latest/spid.json';

fetch(spidMetadataUrl, { headers: { 'Authorization': apiKey } })
    .then(response => response.json())
    .then(spidData => {
        // (2) 선수 시즌 metadata 불러오기
        const seasonMetadataUrl = 'https://static.api.nexon.co.kr/fconline/latest/seasonid.json';

        fetch(seasonMetadataUrl, { headers: { 'Authorization': apiKey } })
            .then(response => response.json())
            .then(seasonData => {
                // (3) 선수 고유 식별 정보를 통해 선수 시즌 & 이름 가져오는 함수
                // function getPlayerInfo(playerID) {
                //     const playerInfo = [];

                //     const playerSeason = parseInt(String(playerID).slice(0, 3));

                //     console.log('spidData', spidData);
                //     console.log('seasonData', seasonData);

                //     for (const info of seasonData) {
                //         if (info.seasonId === playerSeason) {
                //             playerInfo.push(info.className);
                //         }
                //     }

                //     for (const info of spidData) {
                //         if (info.id === playerID) {
                //             playerInfo.push(info.name);
                //         }
                //     }

                //     return playerInfo.length === 2 ? playerInfo : ['Unknown', 'Unknown'];
                // }
                function getPlayerInfo(playerID) {
                    const playerInfo = [];
                
                    const playerSeason = parseInt(String(playerID).slice(0, 3));
                
                    let seasonInfo = seasonData.find(info => info.seasonId === playerSeason);
                
                    if (seasonInfo) {
                        playerInfo.push(seasonInfo.className);
                    } else {
                        playerInfo.push('Unknown Season');
                    }
                
                    let playerInfoData = spidData.find(info => info.id === playerID);
                
                    if (playerInfoData) {
                        playerInfo.push(playerInfoData.name);
                    } else {
                        playerInfo.push('Unknown Player');
                    }
                    return playerInfo;
                }
                






                // (4) 닉네임을 입력받아 유저 고유 식별자 가져오기
                function getUserId(nickname) {
                    const url = `https://public.api.nexon.com/openapi/fconline/v1.0/users?nickname=${nickname}`;
                                
                    return fetch(url, { headers: { 'Authorization': apiKey } })
                        .then(response => response.json())
                        .then(userInfo => userInfo.accessId);
                }

                // (5) 유저 고유 식별자를 이용하여 이적 시장 거래내역 불러오기
                function getMarketInfo(userAccessId, number) {
                    const url = `https://public.api.nexon.com/openapi/fconline/v1.0/users/${userAccessId}/markets?tradetype=${tradetype}&offset=0&limit=${number}`;

                    return fetch(url, { headers: { 'Authorization': apiKey } })
                        .then(response => response.json())
                        .then(transInfo => {
                            const trans = [];

                            for (const info of transInfo) {
                                const playerInfo = getPlayerInfo(info.spid);
                                trans.push({
                                    "구매 날짜": info.tradeDate.replace("T", " "),
                                    "구매 선수": `${playerInfo[0]} ${playerInfo[1]}`,
                                    "강화 단계": info.grade,
                                    "가격": new Intl.NumberFormat().format(info.value)
                                });
                            }
                            goodPrint(trans);
                            return trans;
                        });
                }

                // (6) 깔끔한 정보 출력을 위한 함수 생성
                function goodPrint(dictList) {
                    let count = 1;

                    for (const index of dictList) {
                        console.log(count);

                        for (const [k, v] of Object.entries(index)) {
                            console.log(`${k}: ${v}\n`);
                        }

                        count++;
                    }
                }

                // (7) HTML 페이지에 결과를 출력하는 함수
                function displayOnHTML(result) {
                    const outputElement = document.getElementById('output');
                    outputElement.innerHTML = '';

                    for (const info of result) {
                        const playerInfo = getPlayerInfo(info["구매 선수"]);
                        info["구매 선수"] = `${playerInfo[0]} ${playerInfo[1]}`;

                        const transactionDiv = document.createElement('div');

                        for (const [k, v] of Object.entries(info)) {
                            const pElement = document.createElement('p');
                            pElement.textContent = `${k}: ${v}`;
                            transactionDiv.appendChild(pElement);
                        }

                        outputElement.appendChild(transactionDiv);
                    }
                }

                // (8) 사용자 입력을 받아 처리하고 HTML에 출력하는 함수
                function loadMarketInfo() {
                    const nickname = document.getElementById('nickname').value;
                    const number = document.getElementById('number').value;

                    getUserId(nickname)
                        .then(userAccessId => getMarketInfo(userAccessId, number))
                        .then(transInfo => {
                            for (const info of transInfo) {
                                const playerInfo = getPlayerInfo(info["구매 선수"]);
                                info["구매 선수"] = `${playerInfo[0]} ${playerInfo[1]}`;
                            }

                            displayOnHTML(transInfo);
                        })
                        .catch(error => console.error('Error:', error));
                }

                // (9) 조회하기 버튼 클릭 시 loadMarketInfo 함수 호출
                document.getElementById('searchButton').addEventListener('click', loadMarketInfo);
            })
            .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));


