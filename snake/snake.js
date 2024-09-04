class Point {
    x: number;
    y: number;
    constructor(xvalue: number, yvalue: number) {
        this.x = xvalue;
        this.y = yvalue;
    }
}

let Dir = 0
let score = -1;
let hiScore = 0;
let trace: Point[] = []
let snack: Point = new Point(-1, -1)

function startGame() {
    // Reset direction, score, and snake trace
    Dir = 0
    score = -1;
    trace = [
        new Point(1, 0),
        new Point(0, 0)
    ]

    // Clear the screen and show the starting snake
    basic.clearScreen();
    for (let element of trace) {
        led.plot(element.x, element.y)
    }

    // Set and draw a new snack
    setSnack()
}

function setSnack() {
    let newSnack: Point = new Point(-1, -1)
    do {
        let snackXPos: number = Math.floor(Math.random() * 5)
        let snackYPos: number = Math.floor(Math.random() * 5)
        newSnack.x = snackXPos;
        newSnack.y = snackYPos;
    } while (isSnakeOnPoint(newSnack))
    snack = newSnack
    led.plot(snack.x, snack.y)
    score++;
}

function isSnakeOnPoint(pt: Point) {
    let result: boolean = false
    for (let element of trace) {
        if (element.x == pt.x && element.y == pt.y) {
            result = true
            break
        }
    }
    return result
}

input.onButtonPressed(Button.B, () => {
    switch (Dir) {
        case 0:
            Dir++;
            break;
        case 1:
            Dir++;
            break;
        case 2:
            Dir++
            break;
        default:
            Dir = 0;
            break;
    }
})

input.onButtonPressed(Button.A, () => {
    switch (Dir) {
        case 0:
            Dir = 3;
            break;
        case 1:
            Dir = 0;
            break;
        case 2:
            Dir = 1;
            break;
        default:
            Dir = 2;
            break;
    }
})

basic.forever(() => {
    basic.pause(500)
    // initialise next head position with current head position
    let nextPosition: Point = new Point(trace[0].x, trace[0].y)
    // set next head position based on button states
    switch (Dir) {
        case 0:
            nextPosition.x = trace[0].x + 1
            break;
        case 1:
            nextPosition.y = trace[0].y + 1
            break;
        case 2:
            nextPosition.x = trace[0].x - 1
            break;
        default:
            nextPosition.y = trace[0].y - 1
            break;
    }

    if (isSnakeOnPoint(nextPosition) || isSnakeOutOfBounds()) {
        endGame()
    }

    // draw new head point in new position
    trace.unshift(nextPosition)
    led.plot(trace[0].x, trace[0].y)

    // if snake landed on a snack, don't delete the last segment
    if (trace[0].x == snack.x && trace[0].y == snack.y) {
        // set new snack position
        setSnack()
    } else {
        led.unplot(trace[trace.length - 1].x, trace[trace.length - 1].y)
        trace.pop()
    }
})

function endGame() {
    while (true) {
        basic.showString(score.toString())
        if (score > hiScore) {
            basic.showIcon(IconNames.SmallHeart)
            basic.showIcon(IconNames.Heart)
        } else {
            basic.showIcon(IconNames.Sad)
        }

        basic.pause(100) // Small pause to allow button press detection

        if (input.buttonIsPressed(Button.AB)) {
            hiScore = score;  // Update the hiScore
            startGame();  // Restart the game after the AB button is pressed
            break;
        }
    }
}

function isSnakeOutOfBounds() {
    let result: boolean = false
    if (trace[0].x > 4 || trace[0].x < 0 || trace[0].y > 4 || trace[0].y < 0) {
        result = true
    }
    return result
}

// Start the game when the program starts
startGame();
