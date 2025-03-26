const AbstractRepository = require("./AbstractRepository");

class ModelDocsRepository extends AbstractRepository {
  constructor() {
    // Initialize with the 'Clients' table name
    super({ table: "Model_Docs" });
  }

  // Example of finding client by user ID
 
  // Add more specific methods for 'Clients' if needed
}

module.exports = ModelDocsRepository;