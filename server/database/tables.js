const AdministratorRepository = require("./models/AdministratorRepository");
const ClientRepository = require("./models/ClientRepository");
const TranslatorRepository = require("./models/TranslatorRepository");
const TranslatorTariffsRepository = require("./models/TranslatorTariffsRepository");
const UserRepository = require("./models/UserRepository");
const ModelDocsRepository = require("./models/ModelDocsRepository");
const LanguagesRepository = require("./models/LanguagesRepository");
const DocumentTypesRepository = require("./models/DocumentTypesRepository");

const tables = {};

// Register repositories
tables.Users = new UserRepository();
tables.Administrators = new AdministratorRepository();
tables.Clients = new ClientRepository();
tables.Translators = new TranslatorRepository();
tables.TranslatorTariffs = new TranslatorTariffsRepository();
tables.ModelDocs = new ModelDocsRepository();
tables.Languages = new LanguagesRepository();
tables.DocumentTypes = new DocumentTypesRepository();

module.exports = new Proxy(tables, {
  get(obj, prop) {
    if (prop in obj) return obj[prop];
    throw new ReferenceError(
      `tables.${prop} is not defined. Did you register it in tables.js?`
    );
  },
});
