const AbstractRepository = require("./AbstractRepository");

class LanguagesRepository extends AbstractRepository {
  constructor() {
    // Initialize with the 'Clients' table name
    super({ table: "Languages" });
  }

  // Example of finding client by user ID
 
  // Add more specific methods for 'Clients' if needed
}

module.exports = LanguagesRepository;