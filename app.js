import axios from 'axios';

export class EcSdk {
  constructor(baseURL, storeID) {
    axios.defaults.baseURL = baseURL;
    axios.defaults.headers.common['store-id'] = storeID;
  }

  // simply fetch all products available
  fetchAllProducts() {
    let query = `{
      products {
        id
        name
        image_url
      }
    }`;

    return this.get(query);
  }

  // fetch on single product
  fetchSingleProduct(id) {
    let query = `{
      products(prodId: "${id}") {
        id
        name
        image_url
      }
    }`;

    return this.get(query);
  }


  // univsersal http request
  get(query) {
    return axios.get(`/`, {params: {query}});
  }
};
