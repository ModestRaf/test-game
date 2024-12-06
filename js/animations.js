const player = document.querySelector('.map-player');
const points = document.querySelectorAll('.point');
const goButton = document.querySelector('.menu__go');

let currentPointIndex = 0;
const duration = 1500;

// Функция анимации по кривой Безье
function animateBezierCurve(startX, startY, controlX, controlY, endX, endY) {
    const startTime = performance.now();
    function step(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Квадратичная кривая Безье
        const interpolatedX = (1 - progress) ** 2 * startX +
            2 * (1 - progress) * progress * controlX +
            progress ** 2 * endX;
        const interpolatedY = (1 - progress) ** 2 * startY +
            2 * (1 - progress) * progress * controlY +
            progress ** 2 * endY;

        player.style.left = `${interpolatedX}px`;
        player.style.top = `${interpolatedY}px`;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function moveToNextPoint() {
    if (currentPointIndex < points.length - 1) {
        const currentPoint = points[currentPointIndex];
        currentPointIndex++;
        const nextPoint = points[currentPointIndex];
        const currentX = currentPoint.offsetLeft - player.offsetWidth / 2;
        const currentY = currentPoint.offsetTop - player.offsetHeight;
        const nextX = nextPoint.offsetLeft - player.offsetWidth / 2;
        const nextY = nextPoint.offsetTop - player.offsetHeight;

        let controlX, controlY;
        switch (currentPointIndex) {
            case 1:
                controlX = (currentX + nextX) / 2 - 15;
                controlY = currentY - 50;
                break;
            case 2:
                controlX = (currentX + nextX) / 2;
                controlY = currentY + 20;
                break;
            case 3:
                controlX = (currentX + nextX) / 2;
                controlY = currentY + 25;
                break;
            case 4:
                controlX = (currentX + nextX) / 2;
                controlY = currentY;
                break;
            case 5:
                controlX = (currentX + nextX) / 2 - 70;
                controlY = currentY - 30;
                break;
            default:
                controlX = (currentX + nextX) / 2;
                controlY = currentY;
        }

        animateBezierCurve(currentX, currentY, controlX, controlY, nextX, nextY);
    }
}

goButton.addEventListener('click', moveToNextPoint);
document.querySelector('.menu__chat').addEventListener('click', function() {
    this.classList.toggle('active');
});