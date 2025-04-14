-- Consolidated Users Table
CREATE TABLE Users (
    Id_User INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'client', 'translator') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id_User)
);
-- Document Types Table
CREATE TABLE Document_Types (
    Id_Type INT NOT NULL AUTO_INCREMENT,
    Type_Name VARCHAR(32) NOT NULL UNIQUE, -- Name of the document type
    Description TEXT, -- Optional description of the document type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id_Type)
);
-- Languages Table
CREATE TABLE Languages (
    Id_Language INT NOT NULL AUTO_INCREMENT,
    Language_Name VARCHAR(32) NOT NULL UNIQUE, -- Name of the language
    Language_Code VARCHAR(4) NOT NULL UNIQUE, -- Code of the language
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id_Language)
);
-- Administrators Table
CREATE TABLE Administrators (
    Id_Admin INT NOT NULL AUTO_INCREMENT,
    Id_User INT NOT NULL,
    FirstName VARCHAR(32) NOT NULL,
    LastName VARCHAR(32) NOT NULL,
    NumberPhone VARCHAR(10) NULL,
    ImagePath VARCHAR(255) DEFAULT "1742373918346-.png",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id_Admin),
    FOREIGN KEY (Id_User) REFERENCES Users(Id_User)
);
-- Clients Table
CREATE TABLE Clients (
    Id_Client INT NOT NULL AUTO_INCREMENT,
    Id_User INT NOT NULL,
    FirstName VARCHAR(32) NOT NULL,
    LastName VARCHAR(32) NOT NULL,
    NumberPhone VARCHAR(10) NULL,
    ImagePath VARCHAR(255) DEFAULT "1742373918346-.png",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id_Client),
    FOREIGN KEY (Id_User) REFERENCES Users(Id_User)
);
-- Translators Table
CREATE TABLE Translators (
    Id_Translator INT NOT NULL AUTO_INCREMENT,
    Id_User INT NOT NULL,
    FirstName VARCHAR(32) NOT NULL,
    LastName VARCHAR(32) NOT NULL,
    NumberPhone VARCHAR(10) NULL,
    ImagePath VARCHAR(255) DEFAULT "1742373918346-.png",
    MotherLanguage INT NOT NULL, -- Added maternal language
    LanguageToTranslate INT NOT NULL, -- Added language to translate
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id_Translator),
    FOREIGN KEY (Id_User) REFERENCES Users(Id_User),
    FOREIGN KEY (MotherLanguage) REFERENCES Languages(Id_Language),
    FOREIGN KEY (LanguageToTranslate) REFERENCES Languages(Id_Language)
);
-- Model Documents Table
CREATE TABLE Model_Docs (
    Id_Doc INT NOT NULL AUTO_INCREMENT,
    Id_Type INT NOT NULL, -- Links to Document_Types
    OriginalLanguage INT NOT NULL,
    LanguageToTranslate INT NOT NULL,
    Status ENUM('pending','translation_in_progress','translation_completed','cancelled', 'translator_assigned', 'completed') NOT NULL,
    Original_File_Path VARCHAR(255) NOT NULL,
    Translated_File_Path VARCHAR(255),
    WordCount INT NOT NULL,
    Description TEXT NOT NULL,
    Id_Client INT,
    Id_Translator INT,
    Price INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Id_Type) REFERENCES Document_Types(Id_Type),
    FOREIGN KEY (Id_Client) REFERENCES Clients(Id_Client),
    FOREIGN KEY (Id_Translator) REFERENCES Translators(Id_Translator),
    FOREIGN KEY (OriginalLanguage) REFERENCES Languages(Id_Language),
    FOREIGN KEY (LanguageToTranslate) REFERENCES Languages(Id_Language),
    PRIMARY KEY (Id_Doc)
);
-- Translator Tariffs Table
CREATE TABLE Translator_Tariffs (
    Id_Tariff INT NOT NULL AUTO_INCREMENT,
    Id_Translator INT NOT NULL, -- Translator setting the tariff
    Id_Type INT NOT NULL, -- Document type (e.g., legal, medical)
    RatePerWord DECIMAL(10, 2) NOT NULL, -- Per-word rate for this type of document
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id_Tariff),
    FOREIGN KEY (Id_Type) REFERENCES Document_Types(Id_Type),
    FOREIGN KEY (Id_Translator) REFERENCES Translators(Id_Translator)
);


