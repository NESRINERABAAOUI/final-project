import axios from "axios"

const URL = 'http://localhost:3310/api/estimations'
let tokenAcces = localStorage.getItem('token');

export const createDevis = async (data) => {
    if (tokenAcces === null) return null
    const devis = await axios.post(URL, data, {
        headers: { 'jwt-token': tokenAcces }
    });
    return devis;

}


export const getDevis = async () => {
    if (tokenAcces != null) {
        const devis = await axios.get(URL, {
            headers: { 'jwt-token': tokenAcces }
        });
        return devis.data
    }
}