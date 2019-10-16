//I am very lazy, this code has undergone exactly 0 cleaning and I do not take responsibility if you contract any sort of rare disease looking at it.

var rows, rs, scl, height, width, slider, rowsText, angleText, checkbox, chkValue;

function setup() {
    width = 1200;
    height = 600;
    createCanvas(width, height);

    rowsText = createP("Rows");
    slider = createSlider(10, 100, 10); //amount of rows
    rowsValText = createP("" + slider.value());

    inAngleTect = createP("Initial Angle");
    slider2 = createSlider(0, 90, 19); //what angle the light ray attacks from
    angleValText = createP(slider2.value() + "&deg;");

    checkbox = createCheckbox("Show Delta", false); //whether to show the a straight line from start to finish  
    checkbox.changed(checkedEvent);

    scl = 1; //the scale of the grid, not used currently
}

function draw() {
    clear();
    rows = slider.value();
    rs = height / rows; //the space between the rows is dynamically calculated every paint-cycle by dividing the height by the rows

    rowsValText.html("" + slider.value());
    angleValText.html(slider2.value() + "&deg;");
    
    //if less then 50 rows we can draw some help lines to show the seperation of the layers
    if(rows < 50) {
        for(let i = 0; i < rows; i++) {
            line(0, i * rs * scl, 1600, i * rs * scl);
        }
    }

    let initialAngle = slider2.value() * Math.PI / 180;
    let firstX = rs * Math.tan(initialAngle);

    //create initial value
    line(0, 0, firstX * scl, 1 * rs * scl);
    
    let fullRowX = firstX;
    let oldSine = Math.sin(initialAngle);
    let lastIndex = -1;

    //note: technically the line we create above is i = 1, the new line every iteration is (i + 1)
    for(let i = 1; i < rows - 1; i++) {
        let sine2 = oldSine / Math.sqrt(i*rs) * Math.sqrt((i + 1)*rs); //calculate the sine-value of our new line
    
        let x2 = Math.tan(Math.asin(sine2)) * rs; //use sinevalue and our known triangle side length to calulate new x value

        //if the sine2 value is above 1 (which happends at the end of the curve i think (or maybe because of rounding or floating-precision errors)) then the above calculation will be NaN
        //since arcsin is undefined for values above 1
        if(Number.isNaN(x2)) {
            break;
        }

        //First x value is the oldx value, first y value is the row we are on. The second x value is the old + the new x-value and the second y value is the new row we are on.
        line(fullRowX * scl, i * rs * scl, (fullRowX + x2) * scl, (i+1) * rs * scl);

        fullRowX += x2;
        oldSine = sine2;
        lastIndex = i;
    }

    if(chkValue) {
        line(0,0, fullRowX * scl, (lastIndex + 1) * rs * scl);
    }
}

function checkedEvent() {
    chkValue = this.checked();
}