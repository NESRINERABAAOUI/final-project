// Import access to database tables
const tables = require("../../database/tables");

const getAll = async (req,res)=>{
    try{
        const allCategories= await tables.DocumentTypes.findAll()
        return res.status(200).json(allCategories)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({  message: "Fetching categorys failed." });
      }
}

const create = async (req, res) => {
    const { typeName, description } = req.body; // Use camelCase in request
  
    try {
      // Check if category code already exists
      const existingTypeName = await tables.DocumentTypes.findOne("Type_Name = ?", [typeName]);
      if (existingTypeName) {
        return res.status(400).json({ success: false, message: "category code already exists." });
      }
  
     
  
      // Insert into the database with proper column names
      const category = await tables.DocumentTypes.create({
        Type_Name: typeName,
        Description: description
      });
  
      return res.status(201).json({ category, success: true, message: "A new category was added" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "category creation failed." });
    }
  };
  

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params; // Extract category ID from request parameters

        // Ensure ID is provided
        if (!id) {
            return res.status(400).json({ message: "category ID is required" });
        }

        // Delete category from database
        const result = await tables.DocumentTypes.delete("Id_Type=?", [id]);

        // Check if any row was deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "category not found" });
        }

        return res.status(200).json({ message: "category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports ={
    create,
    getAll,
    deleteCategory
}