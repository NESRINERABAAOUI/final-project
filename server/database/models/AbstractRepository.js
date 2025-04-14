// Import database client
const database = require("../client");
// Define allowed table names for safety
const allowedTables = [
  "Users",
  "Administrators",
  "Clients",
  "Translators",
  "Languages",
  "Model_Docs",
  "Translator_Tariffs",
  "Translator_Reviews",
  "Document_Types",
];

class AbstractRepository {
  constructor({ table }) {
    if (this.constructor === AbstractRepository) {
      throw new TypeError(
        "Abstract class 'AbstractRepository' cannot be instantiated directly"
      );
    }
    // Validate table name
    if (!allowedTables.includes(table)) {
      throw new Error(`Invalid table name: ${table}`);
    }

    this.table = table;
    this.database = database;
  }
  
  /**
   * Create a new record in the table
   * @param {Object} data - Key-value pairs of column names and values
   * @returns {Object} - The inserted record
   */
  async create(data) {
    try {
      const columns = Object.keys(data).join(", ");
      const placeholders = Object.keys(data).map(() => "?").join(", ");
      const values = Object.values(data);

      const query = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders})`;
      const [result] = await this.database.query(query, values);

      return { id: result.insertId, ...data };
    } catch (error) {
      console.error(`Error inserting into table ${this.table}:`, error);
      throw new Error("Database insert failed");
    }
  }

  /**
   * Find a single record by a where clause
   * @param {String} whereClause - The WHERE clause (e.g., "id = ?")
   * @param {Array} values - Values to replace placeholders in the WHERE clause
   * @returns {Object|null} - The found record or null if none exists
   */
  async findOne(whereClause, values) {
    try {
      const query = `SELECT * FROM ${this.table} WHERE ${whereClause}`;
      const [rows] = await this.database.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error(`Error fetching record from table ${this.table}:`, error);
      throw new Error("Database query failed");
    }
  }

  /**
   * Find all records matching a where clause
   * @param {String} whereClause - The WHERE clause (default is "1")
   * @param {Array} values - Values to replace placeholders in the WHERE clause
   * @returns {Array} - Array of found records
   */
  async findAll(whereClause = "1", values = []) {
    try {
      const query = `SELECT * FROM ${this.table} WHERE ${whereClause}`;
      const [rows] = await this.database.query(query, values);
      return rows;
    } catch (error) {
      console.error(`Error fetching records from table ${this.table}:`, error);
      throw new Error("Database query failed");
    }
  }

  /**
   * Update records matching a where clause
   * @param {Object} data - Key-value pairs of columns to update
   * @param {String} whereClause - The WHERE clause (e.g., "id = ?")
   * @param {Array} values - Values to replace placeholders in the WHERE clause
   * @returns {Object} - The result of the update operation
   */
  async update(data, whereClause, values) {
    try {
      const updates = Object.keys(data).map((key) => `${key} = ?`).join(", ");
      const query = `UPDATE ${this.table} SET ${updates} WHERE ${whereClause}`;
      const [result] = await this.database.query(query, [
        ...Object.values(data),
        ...values,
      ]);

      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error(`Error updating table ${this.table}:`, error);
      throw new Error("Database update failed");
    }
  }

  /**
   * Delete records matching a where clause
   * @param {String} whereClause - The WHERE clause (e.g., "id = ?")
   * @param {Array} values - Values to replace placeholders in the WHERE clause
   * @returns {Object} - The result of the delete operation
   */
  async delete(whereClause, values) {
    try {
      const query = `DELETE FROM ${this.table} WHERE ${whereClause}`;
      const [result] = await this.database.query(query, values);

      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error(`Error deleting from table ${this.table}:`, error);
      throw new Error("Database delete failed");
    }
  }

  /**
   * Build and execute dynamic join queries
   * @param {Array} tables - Array of table names for joins
   * @param {Array} conditions - Array of join conditions (e.g., "table1.col = table2.col")
   * @param {String} selectFields - Comma-separated list of fields to select
   * @param {String} whereClause - WHERE clause (optional)
   * @param {Array} values - Values for the WHERE clause placeholders
   * @returns {Array} - Query result
   */
  async buildJoinQuery(tables, conditions, selectFields, whereClause = "1", values = []) {
    try {
      if (tables.length - 1 !== conditions.length) {
        throw new Error("Mismatch between tables and join conditions");
      }

      let query = `SELECT ${selectFields} FROM ${tables[0]}`;
      for (let i = 1; i < tables.length; i+=1) {
        query += ` JOIN ${tables[i]} ON ${conditions[i - 1]}`;
      }

      query += ` WHERE ${whereClause}`;
      const [rows] = await this.database.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error building join query:", error);
      throw new Error("Join query failed");
    }
  }


  async buildJoinQueryA(tables, conditions, selectFields, whereClause = "1", values = []) {
    try {
        if (tables.length - 1 !== conditions.length) {
            throw new Error("Mismatch between tables and join conditions");
        }

        let query = `SELECT ${selectFields} FROM ${tables[0]}`;
        for (let i = 1; i < tables.length; i++) {
            query += ` JOIN ${tables[i]} ON ${conditions[i - 1]}`;
        }

        query += ` WHERE ${whereClause}`;
        console.info("Generated SQL Query:", query); // Debugging: Log the query
        const [rows] = await this.database.query(query, values);
        return rows;
    } catch (error) {
        console.error("Error building join query:", error);
        throw new Error("Join query failed");
    }
  }
}

module.exports = AbstractRepository;
