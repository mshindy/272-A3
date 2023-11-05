var pc = new PigController()
var form = document.getElementById('add-pig-form')!
var selected: string;
let pigCategorySelector = document.getElementById('pig-category') as HTMLSelectElement
var extraLabel = document.querySelector('label[for="extra-attribute"]')!
var newInput = document.getElementById('extra-attribute') as HTMLInputElement
var restAttributes = document.getElementById('rest-attributes')
let pigListTable = ""
let chosenCategory = ""


function getValueFromInput(id:string) {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    return inputElement.value;
} 

function onLoad(){
    for (const pig of JSON.parse(localStorage.UserArray)) {
        pc.pigs.push(pig);
    }
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

    pigListTable.style.display = "block";

    let deleteCalled = false

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
        moreInfoButton.addEventListener("click", () => {
        // Add your code to display the dropdown info box here
        console.log("More Info button clicked");
        });

        // Create a "Delete" button in the fourth column
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        cell4.appendChild(deleteButton);

        // Add an event listener to the "Delete" button
        deleteButton.addEventListener("click", () => {
        console.log("Deleting " + pig.name);
            if (deleteCalled === false) {
            pc.delete(pig.id);
            }
            deleteCalled = true;
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
pigCategorySelector?.addEventListener("change", () => {
    chosenCategory= pigCategorySelector?.value;

    if (chosenCategory === "Chestnut"){
        extraLabel.innerHTML = "Language:"
        newInput.type = "string"
    }
    else if (chosenCategory === "Black"){
        extraLabel.innerHTML = "Strength:";
        newInput.type = "number"

    }
    else if (chosenCategory === "Grey"){
        extraLabel.innerHTML = "Swimming:";
        newInput.type = "number"

    }
    else {
        extraLabel.innerHTML = "Running:";
        newInput.type = "number"

    }
    restAttributes!.style.display = 'block'
    selected = chosenCategory;

})


document.getElementById('save-pig')?.addEventListener('click', () =>{

    const name = getValueFromInput('pig-name');
    const breed = getValueFromInput('pig-breed');
    const height = parseFloat(getValueFromInput('pig-height'));
    const weight = parseFloat(getValueFromInput('pig-weight'));
    const personality = getValueFromInput('pig-personality');
    const extra = getValueFromInput('extra-attribute');
    
    const newPig = new Pig(selected, name, breed, height, weight, personality, extra);
    pc.add(newPig);
    
    refresh();

})


document.getElementById('get-all')?.addEventListener('click', ()=>{
    console.log(pc.showAll())
})


