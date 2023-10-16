const api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJYLUFwcC1SYXRlLUxpbWl0IjoiNTAwOjEwIiwiYWNjb3VudF9pZCI6IjE2NjE2NDE4ODciLCJhdXRoX2lkIjoiMiIsImV4cCI6MTcxMjU2NDU5NiwiaWF0IjoxNjk3MDEyNTk2LCJuYmYiOjE2OTcwMTI1OTYsInNlcnZpY2VfaWQiOiI0MzAwMTE0ODEiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4ifQ.uZHyGkNLHrjgRsTZmOqAOgZ9mEtYEPyL8OUkBXIKrAg'; 
const nickname = '호날두';
const accessid = '41a65a008a7ec275fe382ee6';

const url1 = `https://public.api.nexon.com/openapi/fconline/v1.0/users?nickname=${nickname}`;




fetch(url1,{headers: {'Authorization': api_key}})
.then(response => response.json())
.then(data => {
    var name = data.nickname;
    document.querySelector(".fcName").innerHTML = name;

    var level = data.level;
    document.querySelector(".fclevel").innerHTML = level;

    var accessId = data.accessId;
    document.querySelector(".fcaccessId").innerHTML = accessId;
});

const tradetype = 'buy'; // 거래 유형 ('buy' 또는 'sell')
const offset = 0; // 시작 위치 (기본값: 0)
const limit = 10; // 가져올 개수 (기본값: 10)

// 이전 코드는 여기에 그대로 둡니다...
const tradeHistoryElement = document.getElementById('tradeHistory');

const url2 = `https://public.api.nexon.com/openapi/fconline/v1.0/users/${accessid}/markets?tradetype=${tradetype}&offset=${offset}&limit=${limit}`;

fetch(url2, { headers: { 'Authorization': api_key } })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            data.forEach(trade => {
                // 각 거래의 정보에 접근합니다.
                const tradeDate = trade.tradeDate;
                const saleSn = trade.saleSn;
                const spid = trade.spid;
                const grade = trade.grade;
                const value = trade.value;

                // 이 정보를 활용하여 HTML 요소를 생성하거나 업데이트합니다.
                const tradeElement = document.createElement('div');
                tradeElement.classList.add('trade');

                tradeElement.innerHTML = `
                    <p>거래일자: ${tradeDate}</p>
                    <p>거래 고유 식별자: ${saleSn}</p>
                    <p>선수 고유 식별자: ${spid}</p>
                    <p>거래 선수 강화 등급: ${grade}</p>
                    <p>거래 선수 가치(BP): ${value}</p>
                `;

                // tradeHistoryElement에 tradeElement를 추가합니다.
                tradeHistoryElement.appendChild(tradeElement);
            });
        } else {
            console.error('데이터가 비어있습니다.');
        }
    })
    .catch(error => console.error('Error:', error));



