import axios from "axios";

const API_URL = "http://localhost:3310/api/tariffs"; // Change to your backend URL

export const getTariffsByTranslator = async (translatorId,token) => {
   const tariffs = await axios.get(`${API_URL}/allTariffsByTranslator/${translatorId}`,{
    headers: {  'Authorization': `Bearer ${token}` }});
    return tariffs; 
};

export const addTariff = async (data,token) => {
   axios.post(`${API_URL}/create`, data, {
    headers: {  'Authorization': `Bearer ${token}` }});
};

export const updateTariff = async (id, data,token) => {
   axios.put(`${API_URL}/update/${id}`, data,{
    headers: {  'Authorization': `Bearer ${token}` }});
};

export const deleteTariff = async (id,token) => {
   axios.delete(`${API_URL}/delete/${id}`, {
    headers: {  'Authorization': `Bearer ${token}` }});
};
export const getTariffsByTranslatorAndType = async (translatorId,typeId,token) => {
    const tariffs = await axios.get(`${API_URL}/TariffsByTranslatorAndType/${translatorId}/${typeId}`,{
     headers: {  'Authorization': `Bearer ${token}` }});
     return tariffs; 
 };