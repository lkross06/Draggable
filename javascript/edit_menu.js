//the node that the edit modal is for
let modalNode = null;

let allowAltClick = true;
let modalShown = false;

//the edit modal (only 1 can show at a time)
let edit = document.getElementById("edit-modal-content");

//duplicates a node
function duplicate(node){
    //do all the basic stuff to create a new node
    let newNode = document.createElement("div");
    newNode.setAttribute("class", "node dupe");
    newNode.setAttribute("id", numNodes.toString());

    document.getElementById("body").appendChild(newNode)
    numNodes++;

    //now set the color, text, size and position to the modal node
    newNode.style.width = ((node.offsetWidth/100) - 1).toString() + "94px";
    newNode.style.height = ((node.offsetHeight/100) - 1).toString() + "94px";
    newNode.style.backgroundColor = node.style.backgroundColor;

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
    document.getElementById("edit-modal-size").style.display = "none";
    document.getElementById("edit-modal-main").style.display = "block";  
}

//show the edit menu and move it to where the mouse alt clicked on the node
function showEdit(node){
    modalShown = true;
    edit.parentNode.style.display = "block";
    edit.style.left = mouseX + "px";
    edit.style.top = mouseY + "px";
    modalNode = node;

    resetMainMenu(node);
    resetSubMenus(node);
    resetEdit();
}

function resetSubMenus(node){
    //color
    resetColorSlider(node);

    //text
    document.getElementById("edit-text").value = node.innerText;

    //size
    let spinner_x = document.getElementById("dim-box-x")
    spinner_x.value = (node.offsetWidth)/100;

    let spinner_y = document.getElementById("dim-box-y")
    spinner_y.value = (node.offsetHeight)/100;
}

//hide the edit menu and hide the color sliders
function hideEdit(){
    edit.parentNode.style.display = "none";
    edit.style.left = "0px";
    edit.style.top = "0px";
    modalShown = false;
    modalNode = null;
}

//updates the values stored in the array and on the UI
function updateRGB(node){
    let r = parseInt(document.getElementById("r-slider").value);
    let g = parseInt(document.getElementById("g-slider").value);
    let b = parseInt(document.getElementById("b-slider").value);

    node.style.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", 0.2)";
}

//changes the dimensions of the target node
function changeDimension(input, xAxis){
    if (modalNode != null && (parseInt(input.value) == input.value)){
        if (parseInt(input.value) > 0){
            if (xAxis){
                modalNode.style.width = (parseInt(input.value) - 1).toString() + "94px";
            } else {
                modalNode.style.height = (parseInt(input.value) - 1).toString() + "94px";
            }
        }
        
    }
}

//gets the background color, parses it (lots of string parsing) and sets the values in the sub-menu to it
function resetColorSlider(node){
    for (let i = 0; i <= 2; i++){
        //man i am so smart with ternary operators
        let color = (i == 0)? "r" : (i == 1)? "g" : "b";
        let bg_color = (node.style.backgroundColor == '')? "rgba(128, 128, 128, 0.2" : node.style.backgroundColor;
        let split1 = bg_color.split("(")[1]
        
        let split2 = split1.split(")")[0]
        let split3 = split2.split(", ")
        let val = parseInt(split3[i])

        //the slider
        document.getElementById(color + "-slider").value = val;
        //the text on the side
        document.getElementById(color + "-val").innerText = val;
        //the text on the main menu 
        document.getElementById(color + "-desc").innerText = val;
    }
}

function resetMainMenu(node){
    //identification
    //edit the description to fit the node
    document.getElementById("num-node").innerText = node.getAttribute("id");

    //cords
    let coords = getGridPosition(node);
    document.getElementById("grid-pos").innerText = "[" + coords.x + ", " + coords.y + "]";

    //size
    let node_width = (node.offsetWidth)/100;
    let node_height = (node.offsetHeight)/100;
    document.getElementById("node-width").innerText = node_width;
    document.getElementById("node-height").innerText = node_height;
}