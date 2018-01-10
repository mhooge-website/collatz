function calculate(startPoint) {
    var progress = startPoint;
    var counter = 0;
    while(progress > 1) {
        if(progress % 2 == 1) progress = (progress * 3) + 1;
        else progress /= 2;
        if(counter % 1000 == 0) console.log(progress);
        counter++;
    }
    document.write(startPoint + " reached " + progress + " in " + counter + " steps.");
}