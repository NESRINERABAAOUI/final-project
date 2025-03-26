const AbstractRepository = require("./AbstractRepository");

class DocumentTypesRepository extends AbstractRepository {
  constructor() {
    // Initialize with the 'Clients' table name
    super({ table: "Document_Types" });
  }

  // Example of finding client by user ID
 
  // Add more specific methods for 'Clients' if needed
}

module.exports = DocumentTypesRepository;