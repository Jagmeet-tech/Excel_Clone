for(let i = 0;i<rows;i++){
    for(let j = 0;j<cols;j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
            let address = addressBar.value; //input
            let [activecell,cellProp] = getCellAndCellProp(address);
            let enteredData = activecell.innerText; //div
            
            if(enteredData === cellProp.value) return;
            
            cellProp.value = enteredData;
            //If cell data modififes remove P-C relation,formula empty,update chilren with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",async (e)=>{
    let inputFormula = formulaBar.value;    //input
    if(e.key === "Enter" && inputFormula ){

        //If change in formula for active cell,remove Par-Child relation,evaluate formula,restablish new Par-Child rel.
        let address = addressBar.value;
        let [cell,cellProp] = getCellAndCellProp(address);
        if(inputFormula !== cellProp.formula)
            removeChildFromParent(cellProp.formula);

        
        addChildToGraphComponent(inputFormula,address);    
        //Check formula is cyclic or not,then evaluate.
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if(cycleResponse){
            // alert("Your formula is cyclic.");
            let response = confirm("Your formula is cyclic. Do you want to trace your path ?");
            while(response === true){
                // keep on tracking the color until user is satisfied.
                await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);
                response = confirm("Your formula is cyclic. Do you want to trace your path again ?");
            }


            removeChildFromGraphComponent(inputFormula,address);
            return;
        }
        
        //Evaluate formula
        let evaluatedValue = evaluateFormula(inputFormula);


        //To update UI and cellProp in db. 
        setCellUIAndCellProp(evaluatedValue,inputFormula,address);
        addChildToParent(inputFormula);
        console.log(sheetDB);

        updateChildrenCells(address);
    }
})


//Both normal and dependency expression solve.
function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");
    for(let i = 0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [cell,cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        } 
    }

    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}


function setCellUIAndCellProp(evaluatedValue,formula,address){
    let [cell,cellProp] = getCellAndCellProp(address);
    //ui update
    cell.innerText = evaluatedValue;  

    //cell object prop update
    cellProp.value = evaluatedValue;    
    cellProp.formula = formula;

}

function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell,parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        } 
    }
}

function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell,parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        } 
    }
}

//establishing graph and its P-C relation
function addChildToGraphComponent(formula,childAddress){
    let [crid,ccid] = decodeRidCidFromAddress(childAddress);    // dependent child coordinates
    let encodedFormula = formula.split(" ");
    for(let i = 0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [prid,pcid] = decodeRidCidFromAddress(encodedFormula[i]);   //parent coordinates
            //B1 = A1 + 10
            //rid -> i,cid-> j
            graphComponentMatrix[prid][pcid].push([crid,ccid]); 
        }
    }
}

//removing graph connection if cycle detected.
function removeChildFromGraphComponent(formula,childAddress){
    let [crid,ccid] = decodeRidCidFromAddress(childAddress);    // dependent child coordinates
    let encodedFormula = formula.split(" ");
    for(let i = 0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [prid,pcid] = decodeRidCidFromAddress(encodedFormula[i]);   //parent coordinates
            graphComponentMatrix[prid][pcid].pop(); //last inserted child remove. 
        }
    }
}

//update children cells recursvily (formula or cell value changes).
function updateChildrenCells(parentAddress){
    let [parentCell,parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;
    for(let i = 0;i<children.length;i++){
        let childAddress = children[i];
        let [childCell,childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue,childFormula,childAddress);
        updateChildrenCells(childAddress);
    }

}