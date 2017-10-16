import axios from 'axios';

export default class EcSdk {
  constructor(baseURL, storeID) {
    axios.defaults.baseURL = baseURL;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['store-id'] = storeID;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  }

  //
  //
  //
  // helpers
  //
  //
  //

  ObjectToStringNoQuotes(object) {
    return JSON.stringify(object).replace(/\"([^(\")"]+)\":/g,"$1:");

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
        cartId
        name
        image_url
        description
      }
    }`;

    return this.get(query);
  }

  // fetch on single product
  fetchSingleProduct(id) {
    let query = `query{
      products(prodId: "${id}") {
        id
        cartId
        name
        image_url
        description
      }
    }`;

    return this.get(query);
  }

  /*****     Cart      *****/
  getCart() {
    let query = `query{
      cart {
        quantity
        value {
          amount
          currency
        }
        items {
          id
          cartId
          name
          unit_price
          quantity
          value {
            amount
            currency
          }
        }
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
  addToCart(id, quantity) {
    let mutation = `mutation{
      addCart (productId:"${id}", quantity:"${quantity}") {
        quantity
        value {
          amount
          currency
        }
        items {
          id
          name
          unit_price
          quantity
          value {
            amount
            currency
          }
        }
      }
    }`;

    return this.post(mutation);
  }

  // remove from cart magic
  removeFromCart(id, quantity) {
    let mutation = `mutation{
      removeCart (productId:"${id}", quantity: "${quantity}") {
        quantity
        items {
          id
          name
          unit_price
          quantity
          value {
            amount
            currency
          }
        }
      }
    }`;

    return this.post(mutation);
  }

  // checkout
  checkoutCart(coData) {
    let { customer, billing, shipping, payment } = coData;
    if(!coData || !customer || !billing || !shipping || !payment) return false;

    let mutation = `mutation{
      checkout (
        customer:${this.ObjectToStringNoQuotes(customer)},
        billing_address:${this.ObjectToStringNoQuotes(billing)},
        shipping_address:${this.ObjectToStringNoQuotes(shipping)},
        payment:${this.ObjectToStringNoQuotes(payment)}
      )
    }`;

    return this.post(mutation);
  }

  // univsersal http POST request
  post(query) {
    return axios.post(`/`, {query});
  }
};
