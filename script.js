document.addEventListener("DOMContentLoaded", function() {
  const cardContainer = document.getElementById("card-container");
  const search = document.getElementById("search");
  const ul = document.getElementById("suggestions");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const pageInfo = document.getElementById("page-info");
  let currentEditNote = null;

  //event listeners for dialog boxes
  const dialog = document.getElementById('add-dialog');
  const edit_dialog = document.getElementById('edit-dialog');
  
  const addButton = document.getElementById('add-button');
  const addForm = document.getElementById('add-form');
  
  const editForm = document.getElementById('edit-form');
  
  const cancelButton = document.getElementById('cancel-btn');
  const cancelButtonEdit = document.getElementById('cancel-btn_edit');
  
  const addsaveButton = document.getElementById('add-save-btn');
  const editsaveButton = document.getElementById('edit-save-btn');
  
  const view_dialoge = document.getElementById('view-dialog');
  const button_cancle_view = document.getElementById('cancel-btn_view');


  const notesPerPage = 4;
  let currentPage = 1;

  // Retrieve notes from localStorage
  

//notes is like [
//    {id:   title:  , body:  , dateCreated:   , dateUpdated:  },
//    {id:   title:  , body:  , dateCreated:   , dateUpdated:  }
//   ]





  //function to handle search
  search.addEventListener('keyup', function() {
    const query = search.value.toLowerCase();
    const filteredNotes = notes.filter(note => note.title.toLowerCase().includes(query));


    ul.innerHTML = '';

    const length = filteredNotes.length > 5 ? 5 : filteredNotes.length;

    //sort filtered notes on the basis of date created
    for (let i = 0; i < filteredNotes.length; i++) {
      for(let j = i+1; j < filteredNotes.length; j++) {
        if(filteredNotes[i].dateUpdated < filteredNotes[j].dateUpdated) {
          var temp = filteredNotes[i];
          filteredNotes[i] = filteredNotes[j];
          filteredNotes[j] = temp;
        }
      }
    }



    for (let i = 0; i < length; i++) {
        const li = document.createElement('li');
        li.textContent = filteredNotes[i].title;
        ul.appendChild(li);
        li.addEventListener('click', () => view_notes(filteredNotes[i].id));
    }
  });



  //to get current date and time 
  function get_date() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  //function to handle delete button click
  function handleDeleteButtonClick(event) {
    const cardId = event.target.closest('.card').id;
    const card = document.getElementById(cardId);
    if (card) {
      card.remove();
      notes.splice(cardId-1, 1);

      for(i = 0; i < notes.length; i++) {
        notes[i].id = i+1;
      }
      
      displayNotes(currentPage);
      console.log(notes);
      localStorage.setItem('notes', JSON.stringify(notes));

      }
    }




  //function to handle edit button click
  function handleEditButtonClick(event) {
    const cardId = event.target.closest('.card').id;
    const note = notes[parseInt(cardId) - 1];
    
    document.getElementById('edit-title').value = note.title;
    document.getElementById('edit-body').value = note.description;
    edit_dialog.showModal();
    editsaveButton.addEventListener('click', () => {
      handleEditSaveButtonSave(cardId);
    });
  }

  //function to handle edit button save
  function handleEditSaveButtonSave(cardId) {
    const formData = new FormData(editForm);
    const formObject = Object.fromEntries(formData.entries());
    const title = formObject.title;
    const body = formObject.body;
    const dateUpdated = get_date(); 

    currentEditNote = cardId
    const note = notes[parseInt(cardId) - 1];
    note.title = title;
    note.description = body;
    note.dateUpdated = dateUpdated;
    
    //replace the new note with old one
    notes[parseInt(currentEditNote) - 1] = note;
    localStorage.setItem('notes', JSON.stringify(notes));

    //update card
    const card = createCard(note);
    cardContainer.replaceChild(card, document.getElementById(currentEditNote));
    edit_dialog.close('save');


  }

  //function to display notes already present in storage 
  function displayNotes(page) {
    cardContainer.innerHTML = ''; // Clear previous notes
    const start = (page - 1) * notesPerPage;
    const end = start + notesPerPage;
    const notesToDisplay = notes.slice(start, end);

    for (let note of notesToDisplay) {
        const card = createCard(note);
        cardContainer.appendChild(card);
        pageInfo.textContent = `Page ${page} of ${Math.ceil(notes.length / notesPerPage)}`;
    }
  }


  //function to display notes when clicked
function view_notes(card_id) {
  const view_title = document.getElementById("view-title");
  const view_body = document.getElementById("view-body");
  const view_created = document.getElementById("view-created");
  const view_updated = document.getElementById("view-updated");

  const note = notes[parseInt(card_id) - 1];
  view_title.textContent = note.title;
  view_body.textContent = note.description;
  view_created.textContent = note.dateCreated;
  view_updated.textContent = note.dateUpdated;
  
  view_dialoge.showModal(); 


}


  

  //function to create a whole new card 
  function createCard(note) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = note.id;

    const card_left = document.createElement("div");
    card_left.className = "card-left";

    const card_right = document.createElement("div");
    card_right.className = "card-right";

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = note.title;

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = note.description;

    const dateCreatedLabel = document.createElement("span");
    dateCreatedLabel.className = "card-date";
    dateCreatedLabel.textContent = "Date created: ";

    const dateCreated = document.createElement("span");
    dateCreated.className = "card-date";
    dateCreated.textContent = note.dateCreated;

    const br = document.createElement("br");

    const dateUpdatedLabel = document.createElement("span");
    dateUpdatedLabel.className = "card-date";
    dateUpdatedLabel.textContent = "Updated on: ";

    const dateUpdated = document.createElement("span");
    dateUpdated.className = "card-date";
    dateUpdated.textContent = note.dateUpdated;

    const buttons = document.createElement("div");
    buttons.className = "card-buttons";

    const editButton = document.createElement("button");
    editButton.className = "edit-note";
    editButton.title = "Edit";
    

    const edit_image = document.createElement("img");
    edit_image.className = "button-image";
    edit_image.src = "edit.svg";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-note";
    deleteButton.title = "Delete";
    

    const delete_image = document.createElement("img");
    delete_image.className = "button-image";
    delete_image.src = "delete.png";

    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);

    card.appendChild(card_left);
    card.appendChild(card_right);

    card_left.appendChild(title);
    editButton.appendChild(edit_image);
    deleteButton.appendChild(delete_image);

    card_right.appendChild(buttons);
    card_left.appendChild(desc);
    card_left.appendChild(dateCreatedLabel);
    card_left.appendChild(dateCreated);
    card_left.appendChild(br);
    card_left.appendChild(dateUpdatedLabel);
    card_left.appendChild(dateUpdated);

    editButton.addEventListener('click', handleEditButtonClick);
    deleteButton.addEventListener('click', handleDeleteButtonClick);

    card_left.addEventListener('click', (event) => {
      const cardId = event.target.closest('.card').id;
      view_notes(cardId);
    });

    return card;
  }




 //event listeners for dialog boxes when saved
  addsaveButton.addEventListener('click', () => {

    const formData = new FormData(addForm);
    const formObject = Object.fromEntries(formData.entries());
    const title = formObject.title;
    const body = formObject.body;

    
    const date = get_date();
    const newNote = { id: notes.length + 1, title: title, description: body, dateCreated: date, dateUpdated: date };
    notes.push(newNote);


    localStorage.setItem('notes', JSON.stringify(notes)); // Save to localStorage

    const card = createCard(newNote);
    cardContainer.appendChild(card);
    displayNotes(currentPage);
    dialog.close('save');
    
});


//event listeners for dialog boxes when cancelled  
  cancelButtonEdit.addEventListener('click', () => {
    edit_dialog.close('cancel');
  });


//event listeners for edit dialog boxes when cancelled
  cancelButton.addEventListener('click', () => {
    dialog.close('cancel');
  });


//event listeners for view dialog boxes when cancelled
  button_cancle_view.addEventListener('click', () => {
    view_dialoge.close('cancel');
  });



//event listeners for pagination
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayNotes(currentPage);
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < Math.ceil(notes.length / notesPerPage)) {
        currentPage++;
        displayNotes(currentPage);
    }
});

addButton.addEventListener('click', () => {
  dialog.showModal();
});





let retrievedNotes = localStorage.getItem('notes');
if (retrievedNotes) {
  notes = JSON.parse(retrievedNotes);
  //console.log("Retrieved notes from local storage:", notes); // Output the note object to console
} else {
  console.log("No note found in local storage.");
}

// Display the initial set of notes
displayNotes(currentPage);




});
