import Notiflix from 'notiflix';
import axios from 'axios';

const url = 'https://pixabay.com/api/';
export const options = {
  q: '',
  key: '38240980-4df59bc1d913ce2e5ea997aeb',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  page: '1',
  per_page: '40',
};

export const getapi = async (value, curPage) => {
  const searchParams = new URLSearchParams(options);
  searchParams.set('q', value);
  searchParams.set('page', curPage);
  const response = await axios.get(`${url}?${searchParams}`);
  return response.data;
};
// getapi();
// я выйду в окно
// options.set('q', valueOfInput)
