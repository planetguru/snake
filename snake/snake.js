// initialise direction with a default value
let Dir = 0

// define starting snake as two point objects in 'trace'array
let trace: point[] = [
    new point(1, 0),
    new point(0, 0)
]

class point {
    XPos: number
    YPos: number
    constructor(x: number, y: number) {
        this.XPos = x;
        this.YPos = y;
    }
    set(x: number, y: number) {
        this.XPos = x;
        this.YPos = y;
    }
}

// show starting snake
for (let element of trace) {
    led.plot(element.XPos, element.YPos)
}

// initialise snack with rogue values 
let snack: point = new point(-1, -1)
// then reset snack and draw it
setSnack()

// randomly set new snack point, but not on snake
function setSnack() {
    let newSnack: point = new point(-1, -1)
    do {
        let snackXPos: number = Math.random(5)
        let snackYPos: number = Math.random(5)
        newSnack.set(snackXPos, snackYPos)
    } while (true == isSnakeOnPoint(newSnack))
    snack = newSnack
    led.plot(snack.XPos, snack.YPos)
}

function isSnakeOnPoint(pt: point) {
    let result: boolean = false
    for (let element of trace) {
        if (element.XPos == pt.XPos && element.YPos == pt.YPos) {
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
    let nextPosition: point = new point(trace[0].XPos, trace[0].YPos)
    // set next head position based on button states
    switch (Dir) {
        case 0:
            nextPosition.XPos = trace[0].XPos + 1
            break;
        case 1:
            nextPosition.YPos = trace[0].YPos + 1
            break;
        case 2:
            nextPosition.XPos = trace[0].XPos - 1
            break;
        default:
            nextPosition.YPos = trace[0].YPos - 1
            break;
    }

    if (isSnakeOnPoint(nextPosition) || isSnakeOutOfBounds()) {
        endGame()
    }

    // draw new head point in new position
    trace.unshift(nextPosition)
    led.plot(trace[0].XPos, trace[0].YPos)

    // if snake landed on a snack, don't delete the last segment
    if (trace[0].XPos == snack.XPos && trace[0].YPos == snack.YPos) {
        // set new snack position
        setSnack()
    } else {
        led.unplot(trace[trace.length - 1].XPos, trace[trace.length - 1].YPos)
        trace.pop()
    }
})

function endGame() {
    basic.showIcon(IconNames.Sad)
}

function isSnakeOutOfBounds() {
    let result: boolean = false
    if (trace[0].XPos > 4 || trace[0].XPos < 0 || trace[0].YPos > 4 || trace[0].YPos < 0) {
        result = true
    } else {
        result = false
    }
    return result
}
