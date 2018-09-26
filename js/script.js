window.onload = () => {

  const contactName = document.querySelector('#name'),
    contactEmail = document.querySelector('#email'),
    addContactBtn = document.querySelector('#addContact'),
    showContactsBtn = document.querySelector('#showContacts'),
    sortContactsBtn = document.querySelector('#sortContacts'),
    saveContactsBtn = document.querySelector('#saveContacts'),
    loadContactsBtn = document.querySelector('#loadContacts'),
    deleteContactBtn = document.querySelector('#deleteContact'),
    clearContactsBtn = document.querySelector('#clearContacts'),
    contactsTableBox = document.querySelector('#contactsList');

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
        alert('Please enter name and e-mail!');
        return;
      }
      this.contactsList.push(contact);
      contactName.value = '';
      contactEmail.value = '';
    }

    remove(contact) {
      this.contactsList.forEach((currentContact, index) => {
        if (contact === currentContact.name) {
          this.contactsList.splice(index, 1);
          alert('Contact removed!');
        }
      });
    }

    sort() {
      this.contactsList.sort(ContactManager.compareByName);
      alert('Contacts sorted!');

    }

    show() {
      contactsTableBox.innerHTML = '';
      if (cm.contactsList.length === 0) {
        contactsTableBox.textContent = 'No contacts to display.';
        return;
      }
      let contactsTable = document.createElement('table');
      contactsTableBox.appendChild(contactsTable);
      cm.contactsList.forEach(currentContact => {
        let tableRow = document.createElement('tr');
        let nameCell = document.createElement('td');
        nameCell.textContent = currentContact.name;
        tableRow.appendChild(nameCell);
        let emailCell = document.createElement('td');
        emailCell.textContent = currentContact.email;
        tableRow.appendChild(emailCell);
        contactsTable.appendChild(tableRow);
      });
    }

    save() {
      localStorage.contacts = JSON.stringify(this.contactsList);
      alert('Contacts saved!');
    }

    load() {
      if (localStorage.contacts !== undefined) {
        this.contactsList = JSON.parse(localStorage.contacts);
        alert('Contacts loaded!');
      }
    }

    delete() {
      //TODO
      //let contactToDelete = prompt('Enter name or email to delete entry.');
    }

    clear() {
      this.contactsList = [];
      contactsTableBox.textContent = 'No contacts to display.';
      alert('Contacts cleared!');
    }

    static compareByName(c1, c2) {
      if (c1.name < c2.name) {
        return -1;
      }
      if (c1.name > c2.name) {
        return 1;
      }
      return 0;
    }

    addTestContacts() {
      cm.add(new Contact('Ronald J. Doak', 'RonaldJDoak@rhyta.com'));
      cm.add(new Contact('Stephanie Sanchez', 'malvar@sbcglobal.net'));
      cm.add(new Contact('Fox Mulder', 'iwnttbelive@fbbi.com'));
      cm.add(new Contact('Yvonne Du Bois', 'yvdbois@yahoo.com'));
      cm.add(new Contact('Takeshi Kovacs', 'tkovacs@envoy.prt'));
      cm.add(new Contact('Angele Stuber', 'fallendj@live.com'));
    }
  }

  const cm = new ContactManager;
  cm.addTestContacts();

  addContactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cm.add(new Contact(contactName.value, contactEmail.value));
    alert('Contact added!');
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
  });

  deleteContactBtn.addEventListener('click', () => {
    cm.delete();
  });

  clearContactsBtn.addEventListener('click', () => {
    cm.clear();
  });

};