window.onload = () => {

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
      this.contactsList.push(contact);
      alert('Contact added!');
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

    printContacts() {
      this.contactsList.forEach(contact => {
        console.log(`${contact.name} ${contact.email}`);
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

    empty() {
      this.contactsList = [];
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
  }

  const cm = new ContactManager;
  const c1 = new Contact('Aria Macleod', 'bmidd@aol.com');
  const c2 = new Contact('Rosanna Muir', 'rossannam@icloud.com');
  const c3 = new Contact('Murphy Stubbs', 'mstubby@gmail.com');
  const c4 = new Contact('Greg Trejo', 'jugalator@outlook.com');
  const c5 = new Contact('Anees Avila', 'howler@hotmail.com');


  //cm.add(c1);
  //cm.add(c2);
  //cm.add(c3);
  //cm.add(c4);
  //cm.add(c5);

  //cm.printContacts();
  //cm.sort();
  //cm.printContacts();
  // cm.save();
  // cm.empty();
  // cm.printContacts();
  //cm.load();
  //cm.printContacts();

};