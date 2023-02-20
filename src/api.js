import axios from 'axios';
const ENDPOINT = 'https://pixabay.com/api/';
const apiKEY = '33720271-cfad09de7463efb54028bd049';

export default class searchImg {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = null;
    this.perPage = 12;
  }
  async getImg() {
    const options = {
      params: {
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: `${this.perPage}`,
        page: `${this.page}`,
      },
    };
    const URL = `${ENDPOINT}?key=${apiKEY}`;
    const res = await axios.get(URL, options);
    const hits = res.data.hits;
    this.totalHits = res.data.totalHits;
    this.nextPage();
    return hits;
  }
  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
