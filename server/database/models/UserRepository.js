const AbstractRepository = require("./AbstractRepository");

class UserRepository extends AbstractRepository {
  constructor() {
    // Initialize with the 'Users' table name
    super({ table: "Users" });
  }

  // Example of a specific method to find a user by email
  async findByEmail(email) {
    const query = "Email = ?";
    const result = await this.findOne(query, [email]);
    return result;
  }

  // You can also create other table-specific methods here, such as findById, create, update, delete, etc.
}

module.exports = UserRepository;
