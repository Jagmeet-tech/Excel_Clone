let sheetFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");
let activeSheetColor = "#ced6e0";

addSheetBtn.addEventListener("click",(e)=>{
    let sheet = document.createElement("div");
    sheet.setAttribute("class","sheet-folder");
    
    let allSheetFolder = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id",allSheetFolder.length);

    sheet.innerHTML = `<div class = "sheet-content">Sheet ${allSheetFolder.length + 1} </div>`;
    sheetFolderCont.appendChild(sheet);
    sheet.scrollIntoView(); //bring DOM element into visibility.
    
    //different sheet and their graph relation..
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})


function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
        //left click = 0,scroll = 1,right = 2
        if(e.button !== 2) return ;

        let allSheetFolder = document.querySelectorAll(".sheet-folder");
        if(allSheetFolder.length === 1){
            alert("You need to have atleast one sheet!!");
            return;
        }

        let response = confirm("Your sheet will be deleted permanently, Are you sure ?");
        if(response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));

        //DB update
        collectedSheetDB.splice(sheetIdx,1);
        collectedGraphComponent.splice(sheetIdx,1);

        //UI change and index update 
        handleSheetUIRemoval(sheet);

        //By default bring DB to sheet 1 (active).
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();

    })
}

function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetFolder = document.querySelectorAll(".sheet-folder");
    for(let i= 0;i<allSheetFolder.length;i++){
        allSheetFolder[i].setAttribute("id",i);
        let sheetContent = allSheetFolder[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i + 1}`;
        allSheetFolder[i].style.backgroundColor = "transparent";
    }

    allSheetFolder[0].style.backgroundColor = activeSheetColor;
}



function handleSheetDB(sheetIdx){
    sheetDB = collectedSheetDB[sheetIdx];  //Picks corresponding sheet data from sheet container db.
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProperties(){
    for(let i = 0;i<rows;i++){
        for(let j = 0;j<cols;j++){
            let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
            cell.click();   //as each cell have events attached. So automatically picks from sheetDB.
        }
    }

    //by default clicking first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet){  //sheet container UI update  
    let allSheetFolder = document.querySelectorAll(".sheet-folder") ;
    for(let i = 0;i<allSheetFolder.length;i++){
        allSheetFolder[i].style.backgroundColor = "transparent";
    }

    sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet){
    sheet.addEventListener("click",(e)=>{
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);    //DB data change
        handleSheetProperties();    //UI sheet cell update
        handleSheetUI(sheet);       //sheet container UI update
    })
}

function createSheetDB(){
    let sheetDB = [];
    for(let i = 0;i<rows;i++){  //rid
    let sheetRow = [];      //single row
    for(let j = 0;j<cols;j++){     //cid
        let cellProp = {
            bold : false,
            italic : false,
            underline : false,
            alignment : "left",
            fontFamily : "Monospace",
            fontSize : "14",
            fontColor : "#000000",
            BGcolor : "#000000" ,    //Just for identification purpose.
            value : "",
            formula: "",
            children : [],
            }
        sheetRow.push(cellProp);
        }   
    sheetDB.push(sheetRow);
    }

    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix(){
    let graphComponentMatrix = [];

    for(let i =0;i<rows;i++){
        let row = [];
        for(let j = 0;j<cols;j++){
            //Why array -> More than 1 child relationship(dependency) 
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}