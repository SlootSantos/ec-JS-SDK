import axios from 'axios';

export class EcSdk {
  constructor(baseURL, storeID) {
    axios.defaults.baseURL = baseURL;
    axios.defaults.headers.common['store-id'] = storeID;
  }

  //
  //
  //
  // QUERY
  //
  //
  //


    /*****     Products      *****/

  // simply fetch all products available
  fetchAllProducts() {
    let query = `query{
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
    let query = `query{
      products(prodId: "${id}") {
        id
        name
        image_url
      }
    }`;

    return this.get(query);
  }

  /*****     Cart      *****/
  getCart() {
    let query = `query{
      cart {
        id
      }
    }`;

    return this.get(query);
  }


  // univsersal http GET request
  get(query) {
    return axios.get(`/`, {params: {query}});
  };



  //
  //
  //
  // MUTATION
  //
  //
  //


  /*****     Cart      *****/

  // add to cart magic
  addToCart(id) {
    let query = `mutation{
      cart (productId:"${id}") {
        quantity
      }
    }`;

    return this.post(query);
  }

  // univsersal http POST request
  post(query) {
    return axios.post(`/`, {query});
  }
};
