window.onload = () => {

  const contactName = document.querySelector('#name'),
    contactEmail = document.querySelector('#email'),
    addContactBtn = document.querySelector('#addContact'),
    addTestContactsBtn = document.querySelector('#addTestContacts'),
    searchBox = document.querySelector('#search'),
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
      this.id = (Number(Date.now()) * Math.random()).toString(36).substr(2, 12);
    }
  }

  class ContactManager {
    constructor() {
      this.contactsList = [];
      this.sortedBy = '';
      this.sortOrder = this.sortOrder ? this.sortOrder : this.sortOrder = 'ascending';
    }

    add(contact) {
      if (contact.name === '' || contact.email === '') {
        this.displayStatusInfo('error', 'Please enter name and e-mail address!');
      } else if (!this.validateEmail(contact.email)) {
        this.displayStatusInfo('error', 'Please enter a valid e-mail address!');
      } else {
        this.contactsList.push(contact);
        this.displayStatusInfo('success', 'Contact added!');
        contactName.value = '';
        contactEmail.value = '';
        this.showContacts(this.contactsList);
      }
    }

    validateEmail(email) {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    search() {
      if (searchBox.value === '') {
        cm.showContacts(this.contactsList);
      } else {
        contactsTableBox.innerHTML = '';
        let searchResult = this.contactsList.filter(contact => {
          return (contact.name.toLowerCase().includes(searchBox.value.toLowerCase())) ||
            (contact.email.toLowerCase().includes(searchBox.value.toLowerCase()));
        });
        this.showContacts(searchResult);
      }
    }

    showContacts(contactsList) {
      contactsTableBox.innerHTML = '';
      if (this.contactsList.length === 0) {
        this.displayStatusInfo('error', 'No contacts to display.');
      } else {
        let contactsTable = document.createElement('table');
        let header = document.createElement('thead');
        let headerRow = document.createElement('tr');
        let headerName = document.createElement('th');
        let headerEmail = document.createElement('th');
        headerName.textContent = 'Name';
        headerEmail.textContent = 'Email';
        headerRow.appendChild(headerName);
        headerRow.appendChild(headerEmail);
        headerRow.querySelectorAll('th').forEach(header => {
          if (header.textContent.toLowerCase().slice(0, 5).trim() === this.sortedBy) {
            if (this.sortOrder === 'ascending') {
              header.textContent += ' ↑';
            } else if (this.sortOrder === 'descending') {
              header.textContent += ' ↓';
            }
          }
        });
        header.appendChild(headerRow);
        contactsTable.appendChild(header);
        contactsTableBox.appendChild(contactsTable);
        let tableBody = document.createElement('tbody');
        contactsList.forEach((currentContact, i) => {
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
            contactsList[i].name = nameCell.textContent;
          });
          emailCell.addEventListener('click', function () {
            this.setAttribute('contenteditable', '');
          });
          emailCell.addEventListener('blur', function () {
            this.setAttribute('contenteditable', 'false');
          });
          emailCell.addEventListener('input', function () {
            contactsList[i].email = emailCell.textContent;
          });
          let deleteCell = document.createElement('td');
          let deleteButton = document.createElement('button');
          let binImage = document.createElement('img');
          binImage.src = 'assets/img/bin.png';
          binImage.dataset.contactID = currentContact.id;
          binImage.alt = 'Delete this contact';
          deleteButton.appendChild(binImage);
          deleteButton.addEventListener('click', (e) => {
            cm.deleteContact(e);
          });
          deleteCell.appendChild(deleteButton);
          tableRow.appendChild(deleteCell);
          tableBody.appendChild(tableRow);
          contactsTable.appendChild(tableBody);
        });
        let tableHeaders = document.querySelectorAll('th');
        tableHeaders.forEach(header => {
          header.addEventListener('click', (e) => {
            this.sortContacts(e, contactsList);
            this.showContacts(contactsList);
          });
        });
      }
    }

    save() {
      localStorage.contacts = JSON.stringify(this.contactsList);
      this.contactsList.length > 0 ? this.displayStatusInfo('success', 'Contacts saved!') : this.displayStatusInfo('error', 'No contacts to save!');
    }

    load() {
      if (localStorage.contacts) {
        this.contactsList = JSON.parse(localStorage.contacts);
        this.displayStatusInfo('success', 'Contacts loaded!');
        cm.showContacts(this.contactsList);
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
          this.showContacts(this.contactsList);
        }
      });
      if (!matchingContact) {
        this.displayStatusInfo('error', 'No entry found with given name or email.');
      }
    }

    deleteContact(e) {
      this.contactsList.forEach(contact => {
        contact.id === e.target.dataset.contactID ? this.contactsList.splice(this.contactsList.indexOf(contact), 1) : '';
      });
      this.displayStatusInfo('info', 'Contact deleted!');
      cm.search();
    }

    clear() {
      this.contactsList = [];
      this.displayStatusInfo('info', 'Contacts cleared!');
    }

    sortContacts(e, contactsList) {
      const headerClicked = e.target.textContent.toLowerCase().slice(0, 5).trim();
      this.sortOrder ? this.sortOrder : this.sortOrder = 'ascending';
      if (this.sortedBy === headerClicked && this.sortOrder === 'ascending') {
        this.sortOrder = 'descending';
      } else if (this.sortedBy === headerClicked && this.sortOrder === 'descending') {
        this.sortOrder = 'ascending';
      }
      const sort = (sortBy) => contactsList.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      if (this.sortOrder === 'ascending') {
        sort(headerClicked);
        this.sortedBy = headerClicked;
        this.showContacts(contactsList);
      } else if (this.sortOrder === 'descending') {
        sort(headerClicked);
        this.sortedBy = headerClicked;
        contactsList.reverse();
        this.showContacts(contactsList);
      }
    }

    displayStatusInfo(statusType, message) {
      statusWindow.style.display = 'block';
      statusWindow.className = 'status-window';
      statusWindow.offsetHeight; /* trigger reflow */
      if (statusType === 'success') {
        statusWindow.className += ' success';
      } else if (statusType === 'info') {
        statusWindow.className += ' info';
      } else if (statusType === 'error') {
        statusWindow.className += ' error';
      }
      statusWindow.textContent = message;
    }

    addTestContacts() {
      cm.add(new Contact('Paul Muad\'Dib', 'mdibpaul@atreides.net'));
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
  });

  addTestContactsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cm.addTestContacts();
  });

  searchBox.addEventListener('input', () => {
    cm.search();
  });

  searchBox.addEventListener('focus', () => {
    cm.contactsList.length > 0 ? cm.search() : '';
  });

  saveContactsBtn.addEventListener('click', () => {
    cm.save();
  });

  loadContactsBtn.addEventListener('click', () => {
    cm.load();
  });

  deleteContactBtn.addEventListener('click', () => {
    cm.delete();
  });

  clearContactsBtn.addEventListener('click', () => {
    cm.clear();
    cm.showContacts(cm.contactsList);
  });

};
