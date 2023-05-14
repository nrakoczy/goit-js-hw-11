import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36389818-5d3972b65ac518b4ed94f04af';

export async function fetchImage(name, page = 1, limit = 20) {
  const params = {
    key: API_KEY,
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: limit,
  };
  try {
    const response = await axios.get(BASE_URL, { params });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}
