//size of node (in pixels)
const len = 100;
//current mouse pos
let mouseX = 0;
let mouseY = 0;
//the OG mouse pos when user first clicked the node
let prevMouseX = 0;
let prevMouseY = 0;
//original offsets for the node when user first clicked
let ogNodeX;
let ogNodeY;

let mouseDown = false;

let currentNode = null;
let numNodes = 0;
//grid snap (in pixels)
let tick = 0;

//move the currently selected drag node. if its the first drag, take note of the original coordinates of the node/mouse to use as translation pointers
function moveCurrentNode() {
    if (firstTime) {
        tempX = mouseX;
        tempY = mouseY;
        ogNodeX = currentNode.offsetLeft;
        ogNodeY = currentNode.offsetTop;
        firstTime = false;
    }
    let offsetX = ((mouseX - tempX) + ogNodeX);
    let offsetY = ((mouseY - tempY) + ogNodeY);
    currentNode.style.top = offsetY + "px";
    currentNode.style.left = offsetX + "px";
}

//snap the node to the grid (if the grid is used)
function snapToGrid(node) {
if (tick != 0){
    //X grid snap
    let factorX = node.offsetLeft/tick; //how many times the current X goes into the grid (basically how many tiles across)
    let belowX = Math.floor(factorX) * tick; //the multiple of the grid tick val that is directly below the current X
    let belowDiffX = Math.abs(belowX - node.offsetLeft); //the distance between the bottom threshold and current X val
    let aboveX = belowX + tick; //the multiple of the grid tick val that is directly after the current X (aka after the below threshold)
    let aboveDiffX = Math.abs(aboveX - node.offsetLeft); //the distance between the top threshold and current X val

    if (belowDiffX < aboveDiffX){
        //round down
        node.style.left = belowX + "px";
    } else {
        //round down
        node.style.left = aboveX + "px";                   
    }

    //Y grid snap
    let factorY = node.offsetTop/tick; //how many times the current Y goes into the grid (basically how many tiles across)
    let belowY = Math.floor(factorY) * tick; //the multiple of the grid tick val that is directly below the current Y
    let belowDiffY = Math.abs(belowY - node.offsetTop); //the distance between the bottom threshold and current Y val
    let aboveY = belowY + tick; //the multiple of the grid tick val that is directly after the current Y (aka after the below threshold)
    let aboveDiffY = Math.abs(aboveY - node.offsetTop); //the distance between the top threshold and current Y val

    if (belowDiffY < aboveDiffY){
        //round down
        node.style.top = belowY + "px";
    } else {
        //round up
        node.style.top = aboveY + "px";
    }
}
}

//redraws the background lines when the grid changes
function rewriteGrid(){
let hgrid = document.getElementById("hGrid")
let vgrid = document.getElementById("vGrid")
//first delete existing lines
while (hgrid.lastChild){
    hgrid.removeChild(hgrid.lastChild);
}
while (vgrid.lastChild){
    vgrid.removeChild(vgrid.lastChild);
}
if (tick != 0){
    //then draw new lines
for (let i = 0; i < window.outerHeight - tick; i += tick){
    //make the horizontal line
    let hLine = document.createElement("div");
    hLine.setAttribute("class", "hLine gridline");
    hLine.style.top = i + "px";
    hgrid.appendChild(hLine);
}
for (let i = 0; i < window.outerWidth; i+= tick){
    //make the vertical line
    let vLine = document.createElement("div");
    vLine.setAttribute("class", "vLine gridline");
    vLine.style.left = i + "px";
    vgrid.appendChild(vLine)  
}
}

}

//adds a node with text
function addNode() {
    let newNode = document.createElement("div");
    newNode.setAttribute("class", "node");
    newNode.setAttribute("id", numNodes.toString());
    newNode.style.backgroundColor = "rgba(128, 128, 128, 0.2)"

    document.getElementById("body").appendChild(newNode)
    numNodes++;

    if (tick != 0) snapToGrid(newNode);
}

function updateCoords() {
//update the mouse coordinates
let e = window.event;
mouseX = e.clientX;
mouseY = e.clientY;
}

//deletes a node and hides the edit menu (you can only delete it if the edit menu is open)
function deleteNode(node){
if (node != null){
    node.parentNode.removeChild(node);
    hideEdit();
}

}