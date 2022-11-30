const fs = require("fs").promises;
const path = require("path");
const shortid = require("shortid");
const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const response = await fs.readFile(contactsPath);
    return JSON.parse(response);
  } catch (err) {
    console.error(err.message);
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === String(contactId));
  return result || null;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const contactsNew = { id: shortid.generate(), name, email, phone };
  const contactsList = JSON.stringify([contactsNew, ...contacts], null, "\t");
  fs.writeFile(contactsPath, contactsList, (err) => {
    if (err) console.error(err);
  });
  return contactsNew;
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === String(contactId));
    if(index === -1) {
      return null;
    }
    contacts.splice(index, 1);
    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts;
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
