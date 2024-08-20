$(document).ready(function() {
    var character = $('#character');
    var gameArea = $('#gameArea');
    var gameHeight = gameArea.height();
    var gameWidth = gameArea.width();
    var lines = 7;
    var lineHeight = gameHeight / lines;
    var currentLine = 1; // 시작 줄 (1번 줄)
    var phase = 1;
    var speed = 200; // 장애물 이동 속도
    var mess = 100; // 장애물 출현 빈도

    var isRestarting = false; // 재시작 여부를 확인하는 플래그

    // 캐릭터 초기 위치 설정
    function setCharacterPosition() {
        character.css('bottom', currentLine * lineHeight + 'px');
        character.css('left', '50%'); // 가운데 정렬
    }
    
    setCharacterPosition();

    // 캐릭터 이동
    function moveCharacter() {
        if (currentLine < lines) {
            currentLine++;
            setCharacterPosition();

            if (currentLine === lines) {
                alert('클리어 했습니다! ' + phase + ' phase ' + ' mess: ' + mess + ' speed: ' + speed);
                phase++;
                mess = mess - 100;
                speed = speed - 50;
                // 장애물 출현 빈도와 속도를 즉시 반영하기 위해 리셋
                currentLine = 1;
                setCharacterPosition();
                isRestarting = true; // 재시작 상태로 설정

                // 재시작 상태 해제
                setTimeout(function() {
                    isRestarting = false;
                }, 500); // 0.5초 후 재시작 플래그 해제
            }
        }
    }

    // 장애물 생성
    function createObstacle(line, obstacleSpeed, direction) {
        var obstacle = $('<div class="obstacle"></div>');
        obstacle.css('top', line * lineHeight + 'px');

        // 장애물 방향에 따라 클래스 추가
        if (direction === 'left') {
            obstacle.addClass('left'); // 왼쪽에서 오른쪽으로 이동하는 장애물
            obstacle.css('left', gameWidth + 'px'); // 오른쪽에서 시작
        } else {
            obstacle.addClass('right'); // 오른쪽에서 왼쪽으로 이동하는 장애물
            obstacle.css('left', '-50px'); // 왼쪽에서 시작
        }

        gameArea.append(obstacle);

        var interval = setInterval(function() {
            var pos = obstacle.position().left;

            if (direction === 'left') {
                obstacle.css('left', pos - obstacleSpeed + 'px'); // 왼쪽으로 이동
            } else {
                obstacle.css('left', pos + obstacleSpeed + 'px'); // 오른쪽으로 이동
            }

            // 충돌 검사
            if (!isRestarting && checkCollision(character, obstacle)) {
                alert('충돌했습니다! 다시 시작합니다.');
                currentLine = 1;
                setCharacterPosition();
                isRestarting = true; // 재시작 상태로 설정

                // 재시작 상태 해제
                setTimeout(function() {
                    isRestarting = false;
                }, 500); // 0.5초 후 재시작 플래그 해제
            }

            // 장애물이 화면을 벗어나면 제거
            if (pos + obstacle.width() < 0 || pos > gameWidth) {
                clearInterval(interval);
                obstacle.remove();
            }
        }, 20); // 일정한 주기로 장애물 이동
    }

    // 충돌 체크
    function checkCollision(character, obstacle) {
        var charPos = character.position();
        var obsPos = obstacle.position();

        return !(charPos.left + character.width() < obsPos.left ||
                 charPos.left > obsPos.left + obstacle.width() ||
                 charPos.top + character.height() < obsPos.top ||
                 charPos.top > obsPos.top + obstacle.height());
    }

    // 랜덤 장애물 생성
    function startObstacles() {
        setInterval(function() {
            var line = Math.floor(Math.random() * (lines - 2)) + 1;
            var obstacleSpeed = 15 + Math.random() * 15; // 속도 증가
            var direction;

            // 2, 4, 6줄은 오른쪽에서 왼쪽으로, 3, 5줄은 왼쪽에서 오른쪽으로 장애물 이동
            if (line === 2 || line === 4 || line === 6) {
                direction = 'left'; // 오른쪽에서 왼쪽으로 이동
            } else if (line === 3 || line === 5) {
                direction = 'right'; // 왼쪽에서 오른쪽으로 이동
            } else {
                return; // 1번 줄이나 7번 줄에서는 장애물 생성 방지
            }

            createObstacle(line, obstacleSpeed, direction);
        }, mess); // 장애물 출현 빈도 조절
    }

    // 이벤트 리스너
    $(document).on('click keydown', function() {
        moveCharacter();
    });

    startObstacles();
});
