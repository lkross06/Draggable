//the node that the edit modal is for
let modalNode = null;

let allowAltClick = true;
let modalShown = false;

//the edit modal (only 1 can show at a time)
let edit = document.getElementById("edit-modal-content");
/**
 * keep track of all RGB values for each node
 * [
 *   [r, g, b] //rgb vals for node 0
 *   [r, g, b] //rgb vals for node 1
 *   ...
 * ]
 */
let backgrounds = new Array();

function duplicate(node){
    //do all the basic stuff to create a new node
    let newNode = document.createElement("div");
    newNode.setAttribute("class", "node dupe");
    newNode.setAttribute("id", numNodes.toString());

    document.getElementById("body").appendChild(newNode)
    numNodes++;

    //now set the color, text and position to the modal node
    let index = node.getAttribute("id");
    let rgb = backgrounds[index];
    newNode.style.backgroundColor = "rgba("+rgb[0]+", "+rgb[1]+", "+rgb[2]+", 0.2)";
    //we also have to make a new array entry
    backgrounds.push(rgb);

    newNode.innerText = node.innerText;

    newNode.style.left = node.offsetLeft + "px";
    newNode.style.top = node.offsetTop + "px";

    //finally, hide the edit menu
    hideEdit();
}

//gets the grid position of the node (assuming one exists)
function getGridPosition(node){
    let x = "none";
    let y = "none";
    if (tick != 0){
        //get the distance between the left side and the left window edge, divide by the tick to get how many in-between, then add one to get the space the node is on
        x = ((node.offsetLeft - (len/2 - tick/2))/tick) + 1;
        
        //repeat for Y
        y = ((node.offsetTop - (len/2 - tick/2))/tick) + 1;
        
        //then check if you need to round up (only if its smaller grid than the nodes)
        if (len > tick){
            if (Math.floor(x) != x) x = Math.floor(x) + 1;
            if (Math.floor(y) != y) y = Math.floor(y) + 1;
        } else {
            //still try and floor it
            x = Math.floor(x);
            y = Math.floor(y);
        }
    }
    return {
        x: x,
        y: y
    };
}

//toggles to a sub-menu of the edit menu
function showSubMenu(prompt){
    document.getElementById(prompt).style.display = "block";
    document.getElementById("edit-modal-main").style.display = "none";
}

//resets the edit modal to the main menu
function resetEdit(){
    document.getElementById("edit-modal-color").style.display = "none";
    document.getElementById("edit-modal-text").style.display = "none";
    document.getElementById("edit-modal-main").style.display = "block";
}

//show the edit menu and move it to where the mouse alt clicked on the node
function showEdit(node){
    modalShown = true;
    edit.parentNode.style.display = "block";
    edit.style.left = mouseX + "px";
    edit.style.top = mouseY + "px";
    modalNode = node;
    
    //edit the description to fit the node
    document.getElementById("modalNumNode").innerText = node.getAttribute("id");

    //fix submenu values
    //the slider and the text next to it
    document.getElementById("r-slider").setAttribute("val", backgrounds[node.getAttribute("id")][0]);
    document.getElementById("g-slider").setAttribute("val", backgrounds[node.getAttribute("id")][1]);
    document.getElementById("b-slider").setAttribute("val", backgrounds[node.getAttribute("id")][2]);
    document.getElementById("r-val").innerText = backgrounds[node.getAttribute("id")][0];
    document.getElementById("g-val").innerText = backgrounds[node.getAttribute("id")][1];
    document.getElementById("b-val").innerText = backgrounds[node.getAttribute("id")][2];

    //the text on the main menu
    document.getElementById("r-desc").innerText = backgrounds[node.getAttribute("id")][0];
    document.getElementById("g-desc").innerText = backgrounds[node.getAttribute("id")][1];
    document.getElementById("b-desc").innerText = backgrounds[node.getAttribute("id")][2];

    document.getElementById("edit-text").innerText = node.innerText;


    let coords = getGridPosition(node);
    document.getElementById("grid-pos").innerText = "[" + coords.x + ", " + coords.y + "]";
}

//hide the edit menu and hide the color sliders
function hideEdit(){
    edit.parentNode.style.display = "none";
    edit.style.left = "0px";
    edit.style.top = "0px";
    modalShown = false;
    modalNode = null;
    resetEdit();
}

//updates the values stored in the array and on the UI
function updateRGB(node){
    let r = document.getElementById("r-slider").value;
    let g = document.getElementById("g-slider").value;
    let b = document.getElementById("b-slider").value;
    
    let index = node.getAttribute("id");

    backgrounds[index] = [r, g, b];

    node.style.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", 0.2)";
}