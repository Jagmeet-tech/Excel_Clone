let collectedSheetDB = []; //contains all sheets.
let sheetDB = [];       //single sheet (storing mutple rows)

// First time call..
{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
}

// for(let i = 0;i<rows;i++){  //rid
//     let sheetRow = [];      //single row
//     for(let j = 0;j<cols;j++){     //cid
//         let cellProp = {
//             bold : false,
//             italic : false,
//             underline : false,
//             alignment : "left",
//             fontFamily : "Monospace",
//             fontSize : "14",
//             fontColor : "#000000",
//             BGcolor : "#000000" ,    //Just for identification purpose.
//             value : "",
//             formula: "",
//             children : [],
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

//Selectors for cell properties.
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";


//Application of two way binding(ui and data both update)
//Attach property listeners.
bold.addEventListener("click",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    //Modification
    cellProp.bold = !cellProp.bold; //Data change
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";  //Ui change
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
});

italic.addEventListener("click",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    //Modification
    cellProp.italic = !cellProp.italic; //Data change
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";  //Ui change
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
});

underline.addEventListener("click",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    //Modification
    cellProp.underline = !cellProp.underline; //Data change
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";  //Ui change
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
});

fontSize.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    cellProp.fontSize = fontSize.value; //Data change
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})

fontFamily.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    cellProp.fontFamily = fontFamily.value; //Data change
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})

fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value; //Data change
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})

BGcolor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    cellProp.BGcolor = BGcolor.value; //Data change
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})

alignment.forEach((alignElem)=>{
    alignElem.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [cell,cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;
        cell.style.textAlign = alignValue;

        switch(alignValue){
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;   
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break; 
                
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;       
        }
    })
})


// applying individual cell click events to regain back cell properties.
let allCells = document.querySelectorAll(".cell");
for(let i= 0;i<allCells.length;i++){
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell){
    //Work
    cell.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [rid,cid] = decodeRidCidFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        //Apply cell properties in UI saved in storage.
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; 
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;

        //Refelct Ui changes in corresponding container icons as well.
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        switch(cellProp.alignment){
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;   
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break; 
                
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;       
        }

        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText   = cellProp.value;    //div element.
    });
    
}

function getCellAndCellProp(address){
    let [rid,cid] = decodeRidCidFromAddress(address);
    //Access cell and storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell,cellProp];
}

function decodeRidCidFromAddress(address){
    //address-> "A10"

    let rid = Number(address.slice(1)) - 1; //"1" -> 0
    let cid = Number(address.charCodeAt(0)) - 65; //'A' -> 65
    return [rid,cid];
}