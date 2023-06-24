const axios = require('axios/dist/browser/axios.cjs');

export default class NewServer {
  constructor() {
    this.searchName = '';
    this.numberPage = 1;
  }
  async fetchSearch() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '37799169-545c59819f10377b7156167e7';

    const searchParams = new URLSearchParams({
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 30,
      q: this.searchName,
      page: this.numberPage,
    });

    try {
      const response = await axios.get(`${BASE_URL}?${searchParams}`);
      this.data = response.data;
      this.inctementPage();
      return response.data;
    } catch (error) {
      console.log(error);
      new Error('An error occurred during the search.');
      return;
    }
  }
  inctementPage() {
    this.numberPage += 1;
  }

  resetPage() {
    this.numberPage = 1;
  }

  get query() {
    return this.searchName;
  }

  set query(newQuery) {
    return (this.searchName = newQuery);
  }

  totalPages() {
    return Math.ceil(this.data.totalHits / 30);
  }
}