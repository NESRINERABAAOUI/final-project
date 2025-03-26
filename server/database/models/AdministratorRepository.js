const AbstractRepository = require("./AbstractRepository");

class AdministratorRepository extends AbstractRepository {
  constructor() {
    // Initialize with the 'Administrators' table name
    super({ table: "Administrators" });
  }

  // Example of finding administrator by user ID
  async findByUserId(userId) {
    const query = "Id_User = ?";
    const result = await this.findOne(query, [userId]);
    return result;
  }

  // Add more specific methods for 'Administrators' if needed
}

module.exports = AdministratorRepository;
