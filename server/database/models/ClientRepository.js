const AbstractRepository = require("./AbstractRepository");

class ClientRepository extends AbstractRepository {
  constructor() {
    // Initialize with the 'Clients' table name
    super({ table: "Clients" });
  }

  // Example of finding client by user ID
  async findByUserId(userId) {
    const query = "Id_User = ?";
    const result = await this.findOne(query, [userId]);
    return result;
  }

  // Add more specific methods for 'Clients' if needed
}

module.exports = ClientRepository;
