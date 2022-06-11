document.getElementById("tickvals").addEventListener("change", () => {
    //set the tick value and re-draw the lines
    
    //toggle the tick
    if (tick == 0){
        //its down
        tick = 100;
        document.getElementById("tickval-label").setAttribute("class", "button toggled-button")
    } else {
        //its up
        tick = 0;
        document.getElementById("tickval-label").setAttribute("class", "button")
    }
    rewriteGrid();
    for (let node of document.getElementsByClassName("node")){
        snapToGrid(node);
    }
});

document.addEventListener("mouseup", (event) => {
    //set variables to false and snap node to grid
    mouseDown = false;
    firstTime = false;
    if (currentNode != null){
        snapToGrid(currentNode);
        currentNode = null;
    }
    
});

window.addEventListener("resize", rewriteGrid);

document.getElementById("r-slider").addEventListener("mousemove", (event) => {
    document.getElementById("r-val").innerText = document.getElementById("r-slider").value;
    updateRGB(modalNode);
});
document.getElementById("g-slider").addEventListener("mousemove", (event) => {
    document.getElementById("g-val").innerText = document.getElementById("g-slider").value;
    updateRGB(modalNode);
});
document.getElementById("b-slider").addEventListener("mousemove", (event) => {
    document.getElementById("b-val").innerText = document.getElementById("b-slider").value;
    updateRGB(modalNode);
});

document.addEventListener("mousedown", (event) => {
    //if the modal is open see if user clicked on the modal or outside of the modal (to close it)
    if (modalShown){
        if (event.target == document.getElementById("edit-modal")){
            modalShown = false;
            hideEdit();
        }
    }
    //if the alt button was not clicked, alert code that its the first button click (and not a drag)
    if (event.button != 2){
        mouseDown = true;
        firstTime = true;
    } else {
        //if the alt button was clicked, check if it was clicked on while the mouse was over a node
        for (let node of document.getElementsByClassName("node")) {
            if (event.target == node){
                //open the edit menu
                showEdit(node);
            }
        }
    }
});

//dont use browser settings for alt click if its over a node (use custom edit menu instead) or if custom edit menu is open
document.addEventListener("contextmenu", (event) => {
    if (!allowAltClick || modalShown) event.preventDefault();
});

document.addEventListener("mousemove", (event) => {
    updateCoords();
    //if a node is being dragged or hovering over a node, dont allow the default edit menu 
    allowAltClick = true;
    if (currentNode == null) {
        for (let node of document.getElementsByClassName("node")) {
            //check if the node is being selected
            if (event.target == node) allowAltClick = false;
            //if the mouse is down over a certain node, select it to drag
            if (mouseDown && event.target == node) currentNode = node;
        }
    } else {
        allowAltClick = false;
        //if the mouse is still down and the edit menu isnt shown, drag it
        if (mouseDown && !modalShown) {
            moveCurrentNode();
        }
    }
});

document.getElementById("edit-text").addEventListener("keyup", () => {
    modalNode.innerText = document.getElementById("edit-text").value;
});

document.getElementById("dim-box-x").addEventListener("change", () => {
    changeDimension(document.getElementById("dim-box-x"), true)
});
document.getElementById("dim-box-y").addEventListener("change", () => {
    changeDimension(document.getElementById("dim-box-y"), false)
});