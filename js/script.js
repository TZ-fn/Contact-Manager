window.onload = () => {

  const contactName = document.querySelector('#name'),
    contactEmail = document.querySelector('#email'),
    addContactBtn = document.querySelector('#addContact'),
    addTestContactsBtn = document.querySelector('#addTestContacts'),
    searchBox = document.querySelector('#search'),
    showContactsBtn = document.querySelector('#showContacts'),
    sortContactsBtn = document.querySelector('#sortContacts'),
    saveContactsBtn = document.querySelector('#saveContacts'),
    loadContactsBtn = document.querySelector('#loadContacts'),
    deleteContactBtn = document.querySelector('#deleteContact'),
    clearContactsBtn = document.querySelector('#clearContacts'),
    contactsTableBox = document.querySelector('#contactsList'),
    statusWindow = document.querySelector('.status-window');

  class Contact {
    constructor(name, email) {
      this.name = name;
      this.email = email;
    }
  }

  class ContactManager {
    constructor() {
      this.contactsList = [];
    }

    add(contact) {
      if (contact.name === '' || contact.email === '') {
        this.displayStatusInfo('error', 'Please enter name and e-mail!');
      } else {
        this.contactsList.push(contact);
        this.displayStatusInfo('success', 'Contact added!');
        contactName.value = '';
        contactEmail.value = '';
      }
    }

    sort() {
      this.contactsList.sort(ContactManager.compareByName);
      this.displayStatusInfo('success', 'Contacts sorted!');
    }

    search() {
      if (searchBox.value === '') {
        cm.show();
      } else {
        contactsTableBox.innerHTML = '';
        let contactsTable = document.createElement('table');
        let headerRow = document.createElement('tr');
        let headerName = document.createElement('th');
        let headerEmail = document.createElement('th');
        headerName.textContent = 'Name';
        headerEmail.textContent = 'Email';
        headerRow.appendChild(headerName);
        headerRow.appendChild(headerEmail);
        contactsTable.appendChild(headerRow);
        this.contactsList.forEach((contact, i) => {
          if ((contact.name.toLowerCase().includes(searchBox.value.toLowerCase())) ||
            (contact.email.toLowerCase().includes(searchBox.value.toLowerCase()))) {
            let searchResults = [];
            contactsTableBox.appendChild(contactsTable);
            searchResults.push(contact);
            searchResults.forEach(contact => {
              let tableRow = document.createElement('tr');
              let nameCell = document.createElement('td');
              nameCell.textContent = contact.name;
              tableRow.appendChild(nameCell);
              let emailCell = document.createElement('td');
              emailCell.textContent = contact.email;
              tableRow.appendChild(emailCell);
              nameCell.addEventListener('click', function () {
                this.setAttribute('contenteditable', '');
              });
              nameCell.addEventListener('blur', function () {
                this.setAttribute('contenteditable', 'false');
              });
              nameCell.addEventListener('input', function () {
                cm.contactsList[i].name = nameCell.textContent;
              });
              emailCell.addEventListener('click', function () {
                this.setAttribute('contenteditable', '');
              });
              emailCell.addEventListener('blur', function () {
                this.setAttribute('contenteditable', 'false');
              });
              emailCell.addEventListener('input', function () {
                cm.contactsList[i].email = emailCell.textContent;
              });
              let deleteCell = document.createElement('td');
              let deleteButton = document.createElement('button');
              let binImage = document.createElement('img');
              binImage.src = 'assets/img/bin.png';
              binImage.dataset.contactID = this.contactsList.indexOf(contact);
              deleteButton.appendChild(binImage);
              deleteButton.addEventListener('click', (e) => {
                cm.deleteContact(e);
              });
              deleteCell.appendChild(deleteButton);
              tableRow.appendChild(deleteCell);
              contactsTable.appendChild(tableRow);
            });
          }
        });
      }
    }

    show() {
      contactsTableBox.innerHTML = '';
      if (cm.contactsList.length === 0) {
        this.displayStatusInfo('error', 'No contacts to display.');
      } else {
        let contactsTable = document.createElement('table');
        let headerRow = document.createElement('tr');
        let headerName = document.createElement('th');
        let headerEmail = document.createElement('th');
        headerName.textContent = 'Name';
        headerEmail.textContent = 'Email';
        headerRow.appendChild(headerName);
        headerRow.appendChild(headerEmail);
        contactsTable.appendChild(headerRow);
        contactsTableBox.appendChild(contactsTable);
        cm.contactsList.forEach((currentContact, i) => {
          let tableRow = document.createElement('tr');
          let nameCell = document.createElement('td');
          nameCell.textContent = currentContact.name;
          tableRow.appendChild(nameCell);
          let emailCell = document.createElement('td');
          emailCell.textContent = currentContact.email;
          tableRow.appendChild(emailCell);
          nameCell.addEventListener('click', function () {
            this.setAttribute('contenteditable', '');
          });
          nameCell.addEventListener('blur', function () {
            this.setAttribute('contenteditable', 'false');
          });
          nameCell.addEventListener('input', function () {
            cm.contactsList[i].name = nameCell.textContent;
          });
          emailCell.addEventListener('click', function () {
            this.setAttribute('contenteditable', '');
          });
          emailCell.addEventListener('blur', function () {
            this.setAttribute('contenteditable', 'false');
          });
          emailCell.addEventListener('input', function () {
            cm.contactsList[i].email = emailCell.textContent;
          });
          let deleteCell = document.createElement('td');
          let deleteButton = document.createElement('button');
          let binImage = document.createElement('img');
          binImage.src = 'assets/img/bin.png';
          binImage.dataset.contactID = i;
          deleteButton.appendChild(binImage);
          deleteButton.addEventListener('click', (e) => {
            cm.deleteContact(e);
          });
          deleteCell.appendChild(deleteButton);
          tableRow.appendChild(deleteCell);
          contactsTable.appendChild(tableRow);
        });
      }
    }

    save() {
      localStorage.contacts = JSON.stringify(this.contactsList);
      this.displayStatusInfo('success', 'Contacts saved!');
    }

    load() {
      if (localStorage.contacts) {
        this.contactsList = JSON.parse(localStorage.contacts);
        this.displayStatusInfo('success', 'Contacts loaded!');
      } else {
        this.displayStatusInfo('error', 'No contacts to load!');
      }
    }

    delete() {
      let contactToDelete = prompt('Enter name or email to delete entry.'),
        matchingContact = false;
      this.contactsList.forEach(contact => {
        if (contact.name.toLowerCase() === contactToDelete.toLowerCase() ||
          contact.email.toLowerCase() === contactToDelete.toLowerCase()) {
          this.contactsList.splice(this.contactsList.indexOf(contact), 1);
          matchingContact = true;
          this.displayStatusInfo('info', 'Contact deleted.');
          cm.show();
        }
      });
      if (!matchingContact) {
        this.displayStatusInfo('error', 'No entry found with given name or email.');
      }
    }

    deleteContact(e) {
      this.contactsList.splice(e.target.dataset.contactID, 1);
      this.displayStatusInfo('info', 'Contact deleted');
      cm.search();
    }

    clear() {
      this.contactsList = [];
      this.displayStatusInfo('info', 'Contacts cleared!');
    }

    static compareByName(contact1, contact2) {
      if (contact1.name < contact2.name) {
        return -1;
      }
      if (contact1.name > contact2.name) {
        return 1;
      }
      return 0;
    }

    displayStatusInfo(statusType, message) {
      statusWindow.style.display = 'block';
      statusWindow.className = 'status-window';
      statusWindow.offsetHeight; /* trigger reflow */
      if (statusType === 'success') {
        statusWindow.className += ' success';
      } else if (statusType === 'info') {
        statusWindow.className += ' info';
      } else {
        statusWindow.className += ' error';
      }
      statusWindow.textContent = message;
    }

    addTestContacts() {
      cm.add(new Contact("Paul Muad'Dib", 'mdibpaul@atreides.net'));
      cm.add(new Contact('Ronald J. Doak', 'RonaldJDoak@rhyta.com'));
      cm.add(new Contact('Fox Mulder', 'iwnttbelive@fbbi.com'));
      cm.add(new Contact('Yvonne Du Bois', 'yvdbois@yahoo.com'));
      cm.add(new Contact('Takeshi Kovacs', 'tkovacs@envoy.prt'));
      cm.add(new Contact('Angele Stuber', 'fallendj@live.com'));
      cm.add(new Contact('Harry Pooter', 'hapoot@gmail.com'));
      cm.add(new Contact('Devin Irwin', 'wildfire@icloud.com'));
      cm.add(new Contact('Pilot Pirx', 'fiasco@onet.pl'));
      cm.add(new Contact('Sofia Perez', 'soperez@outlook.com'));
    }
  }

  const cm = new ContactManager;

  addContactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cm.add(new Contact(contactName.value, contactEmail.value));
    cm.show();
  });

  addTestContactsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cm.addTestContacts();
    cm.show();
  });

  searchBox.addEventListener('input', () => {
    cm.search();
  });

  showContactsBtn.addEventListener('click', () => {
    cm.show();
  });

  sortContactsBtn.addEventListener('click', () => {
    cm.sort();
    cm.show();
  });

  saveContactsBtn.addEventListener('click', () => {
    cm.save();
  });

  loadContactsBtn.addEventListener('click', () => {
    cm.load();
    cm.show();
  });

  deleteContactBtn.addEventListener('click', () => {
    cm.delete();
  });

  clearContactsBtn.addEventListener('click', () => {
    cm.clear();
    cm.show();
  });

};