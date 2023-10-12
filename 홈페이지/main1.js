const api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJYLUFwcC1SYXRlLUxpbWl0IjoiNTAwOjEwIiwiYWNjb3VudF9pZCI6IjE2NjE2NDE4ODciLCJhdXRoX2lkIjoiMiIsImV4cCI6MTcxMjU2NDU5NiwiaWF0IjoxNjk3MDEyNTk2LCJuYmYiOjE2OTcwMTI1OTYsInNlcnZpY2VfaWQiOiI0MzAwMTE0ODEiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4ifQ.uZHyGkNLHrjgRsTZmOqAOgZ9mEtYEPyL8OUkBXIKrAg'; // 여기에 실제 API 키를 넣어주세요
const nickname = '손흑민우';

const url = `https://public.api.nexon.com/openapi/fconline/v1.0/users?nickname=${nickname}`;

fetch(url,{headers: {'Authorization': api_key}})
.then(response => response.json())
.then(data => {
    var name;
    name = data.nickname;
    document.querySelector(".fcName").innerHTML = name;
    var level;
    level = data.level;
    document.querySelector(".fclevel").innerHTML = level;
});
