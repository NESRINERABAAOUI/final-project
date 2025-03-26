const tables = require("../../database/tables");

const addTarif= async (req,res)=>{
    const {RatePerWord,Id_Type,Id_Translator}=req.body
    try {
        const tarif =await tables.TranslatorTariffs.create({Id_Type,Id_Translator,RatePerWord}) 
        return res.status(201).json(tarif)
    } catch (error) {
        console.info(error)
        return res.status(500).json(error)
    }
}
const updateTarif = async (req,res)=>{
    const { id } = req.params;
    const {RatePerWord}=req.body
    try {
        const tarif =await tables.TranslatorTariffs.update({RatePerWord},'Id_Tariff=?',[id]) 
        return res.status(201).json(tarif)
    } catch (error) {
        console.info(error)
        return res.status(500).json(error)
    }
}
const deleteTarif = async (req,res)=>{
    const { id } = req.params;
    try {
        const tarif =await tables.TranslatorTariffs.delete('Id_Tariff=?',[id]) 
        return res.status(201).json(tarif)
    } catch (error) {
        console.info(error)
        return res.status(500).json(error)
    }
}
const getAllTariffsByTranslator =async(req,res)=> {
    try {
        const {id}=req.params;
        const tarrifs = await tables.TranslatorTariffs.buildJoinQuery(
            ["Translator_Tariffs","Document_Types"],
            ["Translator_Tariffs.Id_Type=Document_Types.Id_Type"],
            "Translator_Tariffs.Id_Tariff,Translator_Tariffs.RatePerWord,Document_Types.Id_Type,Document_Types.Type_Name,Document_Types.Description",
            ["Translator_Tariffs.Id_Translator=?"],[id]
        )
        return res.status(200).json(tarrifs)
    } catch (error) {
        console.info(error)
        return res.status(500).json(error)
    }
}
const getTariffsByTranslatorAndType = async (req, res) => {
    try {
      const { idTanslator, idType } = req.params;
        console.info(idTanslator, idType)
      // Corrected WHERE clause and parameter passing
      let tariff = await tables.TranslatorTariffs.buildJoinQuery(
        ["Translator_Tariffs", "Document_Types"], // Tables to join
        ["Translator_Tariffs.Id_Type = Document_Types.Id_Type"], // Join conditions
        "Translator_Tariffs.Id_Tariff, Translator_Tariffs.RatePerWord, Document_Types.Id_Type, Document_Types.Type_Name, Document_Types.Description", // Select fields
        "Translator_Tariffs.Id_Translator = ? AND Document_Types.Id_Type = ?", // WHERE clause
        [idTanslator, idType] // Values for WHERE clause placeholders
      );
      if (tariff.length === 0) tariff = await tables.TranslatorTariffs.buildJoinQuery(
        ["Translator_Tariffs", "Document_Types"], // Tables to join
        ["Translator_Tariffs.Id_Type = Document_Types.Id_Type"], // Join conditions
        "Translator_Tariffs.Id_Tariff, Translator_Tariffs.RatePerWord, Document_Types.Id_Type, Document_Types.Type_Name, Document_Types.Description", // Select fields
        "Translator_Tariffs.Id_Translator = ? AND Document_Types.Id_Type = 1", // WHERE clause
        [idTanslator] // Values for WHERE clause placeholders
      );
      return res.status(200).json(tariff);
    } catch (error) {
      console.error("Error fetching tariffs by translator and type:", error);
      return res.status(500).json({ error: "Failed to fetch tariffs" });
    }
  };




module.exports={
    addTarif,
    updateTarif,
    getAllTariffsByTranslator,
    deleteTarif,
    getTariffsByTranslatorAndType
}