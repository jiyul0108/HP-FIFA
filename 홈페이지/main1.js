const api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJYLUFwcC1SYXRlLUxpbWl0IjoiNTAwOjEwIiwiYWNjb3VudF9pZCI6IjE2NjE2NDE4ODciLCJhdXRoX2lkIjoiMiIsImV4cCI6MTcxMjU2NDU5NiwiaWF0IjoxNjk3MDEyNTk2LCJuYmYiOjE2OTcwMTI1OTYsInNlcnZpY2VfaWQiOiI0MzAwMTE0ODEiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4ifQ.uZHyGkNLHrjgRsTZmOqAOgZ9mEtYEPyL8OUkBXIKrAg'; // 여기에 실제 API 키를 넣어주세요
const nickname = '손흑민우';
const accessid = '5b81e1decbe8609d95a1d6f3';

const url1 = `https://public.api.nexon.com/openapi/fconline/v1.0/users?nickname=${nickname}`;
const url2 = `https://public.api.nexon.com/openapi/fconline/v1.0/users/${accessid}/markets?tradetype=buy&offset=0&limit=5`;
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

fetch(url2,{headers: {'Authorization': api_key}})
.then(response => response.json())
.then(data => {
    var tradeDate = data.tradeDate;
    document.querySelector(".fctradeDate").innerHTML = tradeDate;


});
