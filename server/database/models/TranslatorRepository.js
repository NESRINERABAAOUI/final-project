const AbstractRepository = require("./AbstractRepository");

class TranslatorRepository extends AbstractRepository {
  constructor() {
    // Initialize with the 'Translators' table name
    super({ table: "Translators" });
  }

  // Example of finding translator by user ID
  async findByUserId(userId) {
    const query = "Id_User = ?";
    const result = await this.findOne(query, [userId]);
    return result;
  }

  // Add more specific methods for 'Translators' if needed
}

module.exports = TranslatorRepository;
