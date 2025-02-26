let domain = "home";  
// domain could be "home","mode", "single", "coop", "pvp",
// "singleHelp","coopHelp", "pvpHelp", "gameover"

let home = null, mode = null, singleHelp = null, single = null;

function setup() {
    createCanvas(800, 600);
}

function draw() {
    background(220);

    if (domain === "home") {
        if (!home) home = new Homescreen(); //create new homescreen only when switching to home domain
        home.displayHomescreen();
    } else {home = null}; // clear when switch to other domains

    if (domain === "mode"){
        if (!mode) mode = new Mode();
        mode.displayMode();
    } else mode = null;

    if (domain === "singleHelp"){
        if (!singleHelp) singleHelp = new SingleHelp();
        singleHelp.displayHelp();
    } else singleHelp = null;

    if (domain === "single"){
        if (!single) {single = new Single();}
        single.displaySingle();
    } else {
        //single.stopGrassDrop(); // Ensure interval is cleared properly
        single = null;
    };
    
}












