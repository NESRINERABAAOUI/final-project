const tables = require("../../database/tables");

// const getAllDocuments = async (req,res)=>{
//     try{
//             const {role}=req.user;
//             if(role!=='admin') return res.status(401).json({message:"you don't have the acces"})

//             const allDocuments= await tables.ModelDocs.findAll()
//             return res.status(200).json(allDocuments)

//         }
//         catch (err) {
//             console.error(err);
//             return res.status(500).json({  message: "Fetching Languages failed." });
//         }
// }
// const getDocumentsByTranslator = async (req, res) => {
//     try {
//         const { id ,status} = req.params; // Get translator ID from request params
//         const {role}=req.user;
//         if(role!=='admin' && role!=='translator') return res.status(401).json({message:"you don't have the acces"})
//         const allDocuments = await tables.ModelDocs.buildJoinQuery(
//             ["Clients", "Translators", "DocumentTypes", "Languages AS OriginalLang", "Languages AS TargetLang"],
//             [
//                 "Translators.Id_Translator = ModelDocs.Id_Translator",
//                 "Clients.Id_Client = ModelDocs.Id_Client",
//                 "DocumentTypes.Id_Type = ModelDocs.Id_Type",
//                 "OriginalLang.Id_Language = ModelDocs.OriginalLanguage",
//                 "TargetLang.Id_Language = ModelDocs.TargetLanguage",
//                 "Translators.Id_Translator = ?",
//                 "ModelDocs.Status=?"

//             ],
//             "Clients.FirstName, Clients.LastName, Translators.Id_Translator, DocumentTypes.Type_Name, DocumentTypes.Description, OriginalLang.Language_Name AS OriginalLanguage, TargetLang.Language_Name AS TargetLanguage",
//             [id,status] // Bind translator ID
//         );

//         return res.status(200).json(allDocuments);
//     } catch (err) {
//         console.error(err);
//         return res.status(400).json({ message: "Fetching documents failed." });
//     }
// };

// // Function to get documents by client
// const getDocumentsByClient = async (req, res) => {
//     try {
//         const { id,status } = req.params; // Get client ID from request params
//         const {role}=req.user;
//         if(role!=='admin' && role!=='translator') return res.status(401).json({message:"you don't have the acces"})
//         const allDocuments = await tables.ModelDocs.buildJoinQuery(
//             ["Clients", "Translators", "DocumentTypes", "Languages AS OriginalLang", "Languages AS TargetLang"],
//             [
//                 "Clients.Id_Client = ModelDocs.Id_Client",
//                 "Translators.Id_Translator = ModelDocs.Id_Translator",
//                 "DocumentTypes.Id_Type = ModelDocs.Id_Type",
//                 "OriginalLang.Id_Language = ModelDocs.OriginalLanguage",
//                 "TargetLang.Id_Language = ModelDocs.TargetLanguage",
//                 "Clients.Id_Clientr = ?",
//                 "ModelDocs.Status=?"
//             ],
//             "Translators.FirstName, Translators.LastName, DocumentTypes.Type_Name, DocumentTypes.Description, OriginalLang.Language_Name AS OriginalLanguage, TargetLang.Language_Name AS LanguageToTranslate ,ModelDocs.WordCount,ModelDocs.Translated_File_Path,ModelDocs.Original_File_Path,ModelDocs.Status",
//             [id,status] // Bind client ID
//         );

//         return res.status(200).json(allDocuments);
//     } catch (err) {
//         console.error(err);
//         return res.status(400).json({ message: "Fetching documents failed." });
//     }
// };
const createDocument = async (req, res) => {
  const {
    documentType,
    originalLanguage,
    languageToTranslate,
    wordCount,
    translator,
    Price,
    Description,
  } = req.body;

  const { userId } = req.user; // Assuming userId is extracted from the authenticated user
  const originalFilePath = req.file ? req.file.path : null; // Get the file path

  // Validate required fields
  if (!originalFilePath) {
    return res.status(400).json({ error: "Original file is required." });
  }
  if (
    !documentType ||
    !originalLanguage ||
    !languageToTranslate ||
    !wordCount ||
    !translator
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  let client;
  try {
    // Find the client associated with the user
    client = await tables.Clients.findOne("Id_User = ?", [userId]);
    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }
  } catch (error) {
    console.error("Error finding client:", error);
    return res.status(500).json({ error: "Failed to find client." });
  }

  try {
    // Create the document in the Model_Docs table
    const document = await tables.ModelDocs.create({
      Id_Type: documentType,
      OriginalLanguage: originalLanguage,
      LanguageToTranslate: languageToTranslate,
      Status: "pending", // Default status
      Original_File_Path: originalFilePath,
      WordCount: wordCount,
      Description: Description || "New translation request", // Default description if not provided
      Id_Client: client.Id_Client,
      Id_Translator: translator,
      Price: Price || wordCount * 0.05, // Default price calculation if not provided
    });

    // Return success response
    return res.status(201).json({
      message: "Document created successfully!",
      document,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return res.status(500).json({ error: "Failed to create document." });
  }
};
const getDocumentsByUserAndStatus = async (req, res) => {
  try {
    const { status } = req.params; // Get status from request params
    const { role, userId } = req.user; // Get user role and ID from the authenticated user

    // Validate user role
    if (role !== "admin" && role !== "translator" && role !== "client") {
      return res.status(401).json({ message: "You don't have access." });
    }

    let queryConditions = [];
    let queryValues = [];

    if (role === "translator") {
      const trans = await tables.Translators.findOne("Id_User = ?", [userId]);
      if (!trans) {
        return res.status(404).json({ message: "Translator not found." });
      }

      // Fetch documents for a translator
      queryConditions = [
        "Clients.Id_Client = Model_Docs.Id_Client",
        "Translators.Id_Translator = Model_Docs.Id_Translator",
        "Document_Types.Id_Type = Model_Docs.Id_Type",
        "OriginalLang.Id_Language = Model_Docs.OriginalLanguage",
        "TargetLang.Id_Language = Model_Docs.LanguageToTranslate",
      ];
      queryValues = [trans.Id_Translator, status];
    } else if (role === "client") {
      const client = await tables.Clients.findOne("Id_User = ?", [userId]);
      if (!client) {
        return res.status(404).json({ message: "Client not found." });
      }

      // Fetch documents for a client
      queryConditions = [
        "Clients.Id_Client = Model_Docs.Id_Client",
        "Translators.Id_Translator = Model_Docs.Id_Translator",
        "Document_Types.Id_Type = Model_Docs.Id_Type",
        "OriginalLang.Id_Language = Model_Docs.OriginalLanguage",
        "TargetLang.Id_Language = Model_Docs.LanguageToTranslate",
      ];
      queryValues = [client.Id_Client, status];
    } else {
      // Admin can fetch all documents
      queryConditions = [
        "Clients.Id_Client = Model_Docs.Id_Client",
        "Translators.Id_Translator = Model_Docs.Id_Translator",
        "Document_Types.Id_Type = Model_Docs.Id_Type",
        "OriginalLang.Id_Language = Model_Docs.OriginalLanguage",
        "TargetLang.Id_Language = Model_Docs.LanguageToTranslate",
      ];
      queryValues = [status];
    }

    // Define the WHERE clause based on the role
    let whereClause;
    if (role === "translator") {
      whereClause = "Translators.Id_Translator = ? AND Model_Docs.Status = ?";
    } else if (role === "client") {
      whereClause = "Clients.Id_Client = ? AND Model_Docs.Status = ?";
    } else {
      whereClause = "Model_Docs.Status = ?";
    }

    // Fetch documents based on role and status
    const allDocuments = await tables.ModelDocs.buildJoinQueryA(
      [
        "Model_Docs",
        "Clients",
        "Translators",
        "Document_Types",
        "Languages AS OriginalLang",
        "Languages AS TargetLang",
      ],
      queryConditions,
      "Model_Docs.Id_Doc, Clients.FirstName AS ClientFirstName, Clients.LastName AS ClientLastName, Clients.NumberPhone AS ClientNumberPhone, Translators.FirstName AS TranslatorFirstName, Translators.LastName AS TranslatorLastName, Translators.NumberPhone AS TranslatorNumberPhone , Document_Types.Type_Name, Document_Types.Description, OriginalLang.Language_Name AS OriginalLanguage, TargetLang.Language_Name AS TargetLanguage, Model_Docs.WordCount, Model_Docs.Translated_File_Path, Model_Docs.Original_File_Path, Model_Docs.Status, Model_Docs.Price,Model_Docs.Description AS DocumentDescription",
      whereClause,
      queryValues
    );

    return res.status(200).json(allDocuments);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Fetching documents failed." });
  }
};

const asignTranslator = async (req, res) => {
  const { docId } = req.params;
  const { status } = req.body;
  try {
    const doc = await tables.ModelDocs.findOne("Id_Doc=?", [docId]);
    if (!doc) return res.status(404).json({ message: "document not found " });

    const updateDoc = { ...doc, Status: status };
    const newDoc = await tables.ModelDocs.update(updateDoc, "Id_Doc=?", [
      docId,
    ]);
    return res.status(200).json(newDoc);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "update documents failed." });
  }
};

const uploadTranslationFile = async (req, res) => {
  const { docId } = req.params;
  const TranslatedFilePath = req.file ? req.file.path : null; // Get the file path
  // Validate required fields
  if (!TranslatedFilePath) {
    return res.status(400).json({ error: "translation file is required." });
  }
  try {
    const doc = await tables.ModelDocs.findOne("Id_Doc=?", [docId]);
    if (!doc) return res.status(404).json({ message: "document not found " });

    const updateDoc = {
      ...doc,
      Translated_File_Path: TranslatedFilePath,
      status: "completed",
    };
    const newDoc = await tables.ModelDocs.update(updateDoc, "Id_Doc=?", [
      docId,
    ]);
    return res.status(200).json(newDoc);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "update documents failed." });
  }
};

module.exports = {
  createDocument,
  getDocumentsByUserAndStatus,
  asignTranslator,
  uploadTranslationFile,
};
