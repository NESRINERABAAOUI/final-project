// Import access to database tables
const tables = require("../../database/tables");

const getAll = async (req,res)=>{
    try{
        const allLanguages= await tables.Languages.findAll()
        return res.status(200).json(allLanguages)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({  message: "Fetching Languages failed." });
      }
}

const create = async (req, res) => {
    const { languageCode, languageName } = req.body; // Use camelCase in request
  
    try {
      // Check if language code already exists
      const existingLanguageCode = await tables.Languages.findOne("Language_Code = ?", [languageCode]);
      if (existingLanguageCode) {
        return res.status(400).json({ success: false, message: "Language code already exists." });
      }
  
      // Check if language name already exists
      const existingLanguageName = await tables.Languages.findOne("Language_Name = ?", [languageName]);
      if (existingLanguageName) {
        return res.status(400).json({ success: false, message: "Language name already exists." });
      }
  
      // Insert into the database with proper column names
      const language = await tables.Languages.create({
        Language_Code: languageCode,
        Language_Name: languageName
      });

      console.info(language)

  
      return res.status(201).json({ language, success: true, message: "A new language was added" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Language creation failed." });
    }
  };
  

const deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params; // Extract language ID from request parameters

        // Ensure ID is provided
        if (!id) {
            return res.status(400).json({ message: "Language ID is required" });
        }

        // Delete language from database
        const result = await tables.Languages.delete("Id_Language=?", [id]);

        // Check if any row was deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Language not found" });
        }

        return res.status(200).json({ message: "Language deleted successfully" });
    } catch (error) {
        console.error("Error deleting language:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports ={
    create,
    getAll,
    deleteLanguage
}