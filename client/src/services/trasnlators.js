import axios from "axios";

const URL = "http://localhost:3310/api/translators";
const tokenAcces = localStorage.getItem('token');

export const getTranslators = async () => {
  const translators = await axios.get(URL,{
    headers: {  'jwt-token': tokenAcces }});
  return translators.data;
};

export const getTranslator = async (id) => {
  const translators = await axios.get(URL, "/", id,{
    headers: {  'jwt-token': tokenAcces }});
  return translators.data;
};
