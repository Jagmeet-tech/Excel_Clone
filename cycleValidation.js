//Storage 2D Matrix
let collectedGraphComponent = [];

let graphComponentMatrix = [];

// for(let i =0;i<rows;i++){
//     let row = [];
//     for(let j = 0;j<cols;j++){
//         //Why array -> More than 1 child relationship(dependency) 
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }

//True : Cyclic , False : Not cyclic
function isGraphCyclic(graphComponentMatrix){
    //Dependency visited,dfsVisited[]
    let visited = [];   //Node visit trace
    let dfsVisited = [];    // stack visit trace

    for(let i = 0;i<rows;i++){
        let visitedRow = [];
        let dfsVisitedRow = [];       
        for(let j = 0;j< cols;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }
  
    
    for(let i = 0;i<rows;i++){
        for(let j = 0;j< cols;j++){
             //Found cycle so return immediately,no need to explore further paths.
             if(visited[i][j] === false){
                let response = dfsCycleDetection(graphComponentMatrix,i,j,visited,dfsVisited);
                if(response == true)
                    return [i,j];   //starting point
             }
        }
    }
    return null;
}

//Start = vis(true) dfsVis(true)
//End = dfsVis(false)
//If vis[i][j] == true -> already explored path,so go back , no use to explore again.
//Condition Cycle detection : if(vis[i][j] == true && dfsVisited[i][j] == true) -> cycle
function dfsCycleDetection(graphComponentMatrix,srcr,srcc,visited,dfsVisited){
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    //A1 -> [[0,1],[1,0],[2,3],...]
    for(let children = 0;children < graphComponentMatrix[srcr][srcc].length;children++){
        let [nbrr,nbrc] = graphComponentMatrix[srcr][srcc][children];
        if(visited[nbrr][nbrc] === false){
            let response = dfsCycleDetection(graphComponentMatrix,nbrr,nbrc,visited,dfsVisited);
            if(response === true)
                return true;    //Found cycle so return immediately,no need to explore further paths.
        }else if(visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true){
             //Found cycle so return immediately.
            return true;
        }
    }   
    dfsVisited[srcr][srcc] = false;
    return false;
}