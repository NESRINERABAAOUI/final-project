const AbstractRepository = require("./AbstractRepository");

class TranslatorTariffsRepository extends AbstractRepository {
  constructor() {
    // Initialize with the 'Clients' table name
    super({ table: "Translator_Tariffs" });
  }

  // Example of finding client by user ID
 
  // Add more specific methods for 'Clients' if needed
}

module.exports = TranslatorTariffsRepository;