var pc = new PigController()
var form = document.getElementById('add-pig-form')!
var selected: string;
let pigCategorySelector = document.getElementById('pig-category') as HTMLSelectElement
var newInput = document.getElementById('extra-attribute') as HTMLInputElement
var restAttributes = document.getElementById('rest-attributes')
var errorContainer = document.getElementById('error-container');
let pigListTable: HTMLTableElement
let chosenCategory: string
const categoryMap = new Map<string,string>([
    ["Chestnut", "Language"],
    ["White", "Swimming Ability"],
    ["Black", "Strength Ability"],
    ["Grey", "Running Ability"]
]);
const categoryTypeMap = new Map<string,string>([
    ["Chestnut", "string"],
    ["White", "number"],
    ["Black", "number"],
    ["Grey", "number"]
]);




function getValueFromInput(id:string) {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    return inputElement.value;
} 

function onLoad(){
    for (const pig of JSON.parse(localStorage.UserArray)) {
        pc.add(pig);
        Pig.num++;
    }
    let index = 0;
        pc.pigs.forEach((pig)=>{
            pig.id = index;
            console.log("PIG NEW ID: " + pig.id)
            index ++;
        })
    refresh()
}
   
function refresh(){

    //reset add pig form
    const pigForm = document.getElementById('add-pig-form')
    const inputs = pigForm!.querySelectorAll('input') 
    const select = pigForm!.querySelector('select')
    let pigListTable = document.getElementById('pig-list') as HTMLTableElement


    if (pigListTable) {
        const tbody = pigListTable.tBodies[0];
        const rows = tbody.rows;
    
        // Iterate through rows
        for (let rowIndex = rows.length - 1; rowIndex >= 0; rowIndex--) {
          const row = rows[rowIndex];
          const cells = row.cells;
    
          // Iterate through cells in the row
          for (let cellIndex = cells.length - 1; cellIndex >= 0; cellIndex--) {
            const cell = cells[cellIndex];
    
            // Remove the cell
            row.deleteCell(cellIndex);
          }
    
          // Remove the row
          tbody.deleteRow(rowIndex);
        }
      }

    form.style.display = 'none'
    
    inputs.forEach((input) =>{
        input.value = ""
    })

    select!.selectedIndex = -1

    if (errorContainer?.style.display === "block"){
        errorContainer.style.display = "none";
    }

    pigListTable.style.display = "block";

    pc.pigs.forEach((pig) =>{
        // Create a new row
        const newRow = pigListTable.insertRow();

        // Create two cells (columns) for the new row
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        // Set the content for the cells
        cell1.textContent = pig.name;
        cell2.textContent = pig.category;
        
        // Create a "More Info" button in the third column
        const moreInfoButton = document.createElement("button");
        moreInfoButton.textContent = "More Info";
        cell3.appendChild(moreInfoButton);

        // Add an event listener to the "More Info" button
        let isMoreInfoVisible = false; // Initial toggle state

        moreInfoButton.addEventListener("click", () => {
            console.log("More Info button clicked");
        
            if (isMoreInfoVisible) {
                // If "More Info" is currently visible, delete it and update the toggle state
                const moreInfoRow = pigListTable.rows[newRow.rowIndex + 1];
                if (moreInfoRow) {
                    pigListTable.deleteRow(newRow.rowIndex + 1);
                }
                isMoreInfoVisible = false;
            } else {
                // If "More Info" is not visible, create and display it, and update the toggle state
                const moreInfoRow = pigListTable.insertRow(newRow.rowIndex + 1);
                const moreInfoCell = moreInfoRow.insertCell(0);
        
                // Create the "More Info" table or div and populate it with additional information
                const moreInfoTable = document.createElement("table"); // You can use a table or a div, depending on your design
                const additionalInfo = document.createElement("p");
                additionalInfo.textContent = `Pig Height: ${pig.height}, Weight: ${pig.weight}, Personality: ${pig.personality}, ${categoryMap.get(pig.category)}: ${pig.extra}`;
                moreInfoTable.appendChild(additionalInfo);
        
                // Insert the "More Info" table or div as a cell in the new row
                moreInfoCell.appendChild(moreInfoTable);
                isMoreInfoVisible = true;
            }
        });

        

        // Create a "Delete" button in the fourth column
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.id = `${pig.id}`
        console.log(deleteButton.id)
        cell4.appendChild(deleteButton);

        // Add an event listener to the "Delete" button
        deleteButton.addEventListener("click", () => {
            console.log("deleting pig: "+ pig.name)
            pc.delete(pig.id)
            refresh()
        });
        
    })
}
    



document.getElementById('add-pig')?.addEventListener('click', () =>{
    
    if (form.style.display === "none"){
        form.style.display = "block";
    }
    else {
        form.style.display = "none";
        return;
    }

})
pigCategorySelector!.addEventListener("change", () => {
    if(pigCategorySelector){
        let extraLabel = document.querySelector('label[for="extra-attribute"]')!;
        let extrainput = document.getElementById('extra-attribute') as HTMLInputElement
        chosenCategory = pigCategorySelector.value;
        extraLabel.innerHTML = categoryMap.get(chosenCategory) as string
        extrainput.type = categoryTypeMap.get(chosenCategory) as string

        restAttributes!.style.display = 'block'
        selected = chosenCategory;
    }

    


// if(extraLabel.){
//     extraLabel = chosenLabel
// }


//     if (chosenCategory === "Chestnut"){
//         extraLabel.innerHTML = "Language:"
//         newInput.type = "string"
//     }
//     else if (chosenCategory === "Black"){
//         extraLabel.innerHTML = "Strength:";
//         newInput.type = "number"

//     }
//     else if (chosenCategory === "Grey"){
//         extraLabel.innerHTML = "Swimming:";
//         newInput.type = "number"

//     }
//     else {
//         extraLabel.innerHTML = "Running:";
//         newInput.type = "number"

//     }
   
})


document.getElementById('save-pig')?.addEventListener('click', () =>{

    const name = getValueFromInput('pig-name');
    const breed = getValueFromInput('pig-breed');
    const height = parseFloat(getValueFromInput('pig-height'));
    const weight = parseFloat(getValueFromInput('pig-weight'));
    const personality = getValueFromInput('pig-personality');
    const extra = getValueFromInput('extra-attribute');
    let errorMarker = false
    

    let array = [name, breed, height, weight, personality, extra]

    for (let i = 0; i < array.length; i++) {
        if (!array[i]){
            console.log("found empty attribute")
            let Error = document.getElementById('empty-error');
            if (Error?.style.display === "none"){
            Error!.style.display = "block"}
            errorMarker = true
        }
    }

    pc.pigs.forEach(element => {
        console.log("comparing personalities for pig" + element.id)
        if (element.personality === personality){
            console.log("personality error found")
            errorMarker = true
            let Error = document.getElementById('personality-error');
            if (Error?.style.display === "none"){
                Error.style.display = "block"
                console.log("error display:" + Error.style.display)
            }
        } 
    });
  
   
    if(chosenCategory == "Grey"){
        let numExtra = parseFloat(extra);
        if (!(numExtra <= 100 && numExtra >= 0 )){
            let Error = document.getElementById('swimming-error');
            if (Error?.style.display === "none"){
                Error!.style.display = "block"}
            errorMarker = true
        }        
    }
    else if(chosenCategory == "White"){
        let numExtra = parseFloat(extra);
        if (!(numExtra <= 100 && numExtra >= 0 )){
            let Error = document.getElementById('running-error');
            if (Error?.style.display === "none"){
                Error!.style.display = "block"}
            errorMarker = true; 
        }        
    }
    else if(chosenCategory == "Black"){
        let numExtra = parseFloat(extra);
        if (!(numExtra <= 10 && numExtra >= 0 )){
            let Error = document.getElementById('strength-error');
            if (Error?.style.display === "none"){
                Error!.style.display = "block"}
            errorMarker = true;
        }        
    }
    if (errorMarker) {return}
    console.log("adding new pig")
    
    const newPig = new Pig(selected, name, breed, height, weight, personality, extra);
    
    pc.add(newPig);
    
    refresh();

})


document.getElementById('get-all')?.addEventListener('click', ()=>{
    console.log(pc.showAll())
})


