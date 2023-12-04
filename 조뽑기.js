let savedNames = [];
let groups = [];

document.getElementById('saveNamesButton').addEventListener('click', function() {
    var input = document.getElementById('namesInput');
    var names = input.value.split(',').map(name => name.trim()).filter(name => name);
    savedNames = savedNames.concat(names);
    updateNamesList(savedNames);
    input.value = ''; // 입력란 초기화
});

document.getElementById('spinButton').addEventListener('click', function() {
    if (savedNames.length < 8) {
        alert('저장된 이름이 최소 8명 이상이어야 합니다.');
        return;
    }

    var shuffledNames = shuffle(savedNames.slice()); // 복사본을 섞음
    var selectedGroup = shuffledNames.slice(0, 8);

    // 선택된 이름을 저장된 이름 목록과 '수련회 친구들' 명단에서 제거
    selectedGroup.forEach(function(name) {
        var nameIndex = savedNames.indexOf(name);
        if (nameIndex > -1) {
            savedNames.splice(nameIndex, 1);
        }
    });
    updateNamesList(savedNames);

    // 선택된 그룹을 조 목록에 추가
    groups.push(selectedGroup);
    displayGroups(groups);

    // 이름 위치 초기화
    resetNamesPosition();

    // 불바퀴 회전 각도 계산
    var randomAngle = Math.random() * 360; // 무작위 각도
    var fixedAngle = randomAngle - (randomAngle % 45); // 뾰족한 부분이 가리킬 각도로 조정

    // 이름 재표시
    displayGroup(selectedGroup, fixedAngle);

    // 불바퀴 회전
    var wheel = document.getElementById('rouletteWheel');
    wheel.style.transition = 'transform 5s';
    wheel.style.transform = `rotate(${fixedAngle}deg)`;

    var sound = document.getElementById('spinSound');
    sound.play()
});

function updateNamesList(names) {
    var namesListDiv = document.getElementById('namesList');
    namesListDiv.innerHTML = ''; // 기존 목록 초기화

    names.forEach(function(name, index) {
        var nameItem = document.createElement('span');
        nameItem.classList.add('name-item');
        nameItem.textContent = name;

        // 삭제 버튼 추가
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() {
            // 해당 이름 삭제
            savedNames.splice(index, 1);
            updateNamesList(savedNames); // 목록 업데이트
        };

        nameItem.appendChild(deleteButton);
        namesListDiv.appendChild(nameItem);
    });
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function displayGroup(group, wheelAngle) {
    var imageSize = 600; // 이미지의 크기
    var wheelCenterX = imageSize / 2; // 이미지 가운데의 X 좌표
    var wheelCenterY = imageSize / 2; // 이미지 가운데의 Y 좌표
    var radius = 330; // 불바퀴 중심에서 이름까지의 반경
    var bubbleSize = 100; // 이름 요소의 크기

    group.forEach(function(name, index) {
        var angle = (index / group.length) * 2 * Math.PI;
        var adjustedAngle = angle - (wheelAngle * Math.PI / 180); // 불바퀴 회전 각도를 고려하여 조정

        // 이름 요소의 중심을 정확한 위치에 배치하기 위해 bubbleSize / 2 를 조정
        var x = wheelCenterX + radius * Math.cos(adjustedAngle) - (bubbleSize / 2);
        var y = wheelCenterY + radius * Math.sin(adjustedAngle) - (bubbleSize / 2);
        var rotateAngle = -adjustedAngle * (180 / Math.PI);

        var bubble = document.getElementById('name' + (index + 1));
        bubble.style.left = `${x}px`; // X 좌표 설정
        bubble.style.top = `${y}px`; // Y 좌표 설정
        bubble.style.transform = `rotate(${rotateAngle}deg)`;

        bubble.classList.add('pop-up');
        bubble.textContent = name;
    });
}
function displayGroups(groups) {
    var groupListsDiv = document.getElementById('groupLists');
    groupListsDiv.innerHTML = ''; // 이전 목록 초기화

    groups.forEach(function(group, index) {
        var groupDiv = document.createElement('div');
        groupDiv.classList.add('group-list');
        groupDiv.innerHTML = `<strong>${index + 1}조:</strong> ` + group.join(', ');
        groupListsDiv.appendChild(groupDiv);
    });
}

function resetNamesPosition() {
    for (let i = 1; i <= 8; i++) {
        var bubble = document.getElementById('name' + i);
        bubble.style.transform = 'none';
        bubble.textContent = '';
    }
}