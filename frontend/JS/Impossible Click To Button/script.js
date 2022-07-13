const evilButton = document.getElementById('evil-button');
const OFFSET = 100;

evilButton.addEventListener('click', () => {
    alert("Nice try.");
    window.close();
});

evilButton.addEventListener("mousemove", (e) => {
    const x = e.pageX;
    const y = e.pageY;
    const buttonBox = evilButton.getBoundingClientRect();
    const verticalDistanceFrom = distanceFromDistance(buttonBox.x, x, buttonBox.width);
    const horizontalDistanceFrom = distanceFromDistance(buttonBox.y, y, buttonBox.height);
    const horizontalOffset = buttonBox.width / 2 + OFFSET;
    const verticalOffset = buttonBox.height / 2 + OFFSET;

    if(Math.abs(horizontalDistanceFrom) <= horizontalOffset && 
       Math.abs(verticalDistanceFrom) <= verticalOffset){
        setButtonPosition(
            buttonBox.x + horizontalOffset / horizontalDistanceFrom * 100,
            buttonBox.y + verticalOffset / verticalDistanceFrom * 100
        );
    }
});

function setButtonPosition(left, top){
    const buttonBox = evilButton.getBoundingClientRect();
    const windowBox = document.body.getBoundingClientRect();

    if (distanceFromDistance(left, windowBox.left, buttonBox.width) < 0){
        left = windowBox.right - buttonBox.width - OFFSET;
    }

    if (distanceFromDistance(left, windowBox.right, buttonBox.width) > 0){
        left = windowBox.left + OFFSET;
    }

    if (distanceFromDistance(top, windowBox.top, buttonBox.height) < 0){
        top = windowBox.bottom - buttonBox.height - OFFSET;
    }

    if (distanceFromDistance(top, windowBox.bottom, buttonBox.height) > 0){
        top = windowBox.top + OFFSET;
    }

    evilButton.style.left = `${left}px`;
    evilButton.style.top = `${top}px`;
}

function distanceFromDistance(boxPosition, mousePosition, boxSize){
    return boxPosition - mousePosition + boxSize / 2;
}