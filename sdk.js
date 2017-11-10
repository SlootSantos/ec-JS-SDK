import axios from 'axios';

export default class EcSdk {
  constructor(baseURL, storeID, paymillPublicKey) {
    window.PAYMILL_PUBLIC_KEY = paymillPublicKey;

    axios.defaults.baseURL = baseURL;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['store-id'] = storeID;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
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
          val_int
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
          val_int
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
    if (coData.payment.type === 'paypal') {
      this.paypalChecksumGeneration(coData.payment)
    } else {
      let { customer, billing, shipping, payment } = coData;
      if (!coData || !customer || !billing || !shipping || !payment) return false;

      this.checkPayment(payment)
      .then(checkedPayment => {

        let mutation = `mutation{
          checkout (
            type:${this.ObjectToStringNoQuotes(checkedPayment.type)}
            customer:${this.ObjectToStringNoQuotes(customer)},
            billing_address:${this.ObjectToStringNoQuotes(billing)},
            shipping_address:${this.ObjectToStringNoQuotes(shipping)},
            payment:${this.ObjectToStringNoQuotes(checkedPayment)}
          )
        }`;

        return this.post(mutation);
      });
    }
  }

  // univsersal http POST request
  post(query) {
    return axios.post(`/`, {query});
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

  paypalChecksumGeneration(ppData) {
    return new Promise((resolve, reject) => {
      let { amount_int, currency, type } = ppData;

      if (!amount_int || !currency) reject();


      let mutation = `mutation{
        paypal (
          type:${this.ObjectToStringNoQuotes(type)}
          amount:${this.ObjectToStringNoQuotes(amount_int)}
          currency:${this.ObjectToStringNoQuotes(currency)}
        ) {
          token
        }
      }`;

      this.post(mutation)
      .then(res => {
        const chks = res.data.data.paypal.token;
        window.paymill.createTransaction({checksum:chks})
      })
    })
  }

  checkPayment(payment) {
    return new Promise((resolve, reject) =>{
      let {
        type,
        first_name,
        last_name,
        accountholder,
        iban,
        bic,
        number,
        exp_month,
        exp_year,
        cvc,
        amount_int,
        currency
      } = payment;

      if (!amount_int || !currency || !type) reject();

      let fullName = first_name + last_name;

      if (type === 'sepa') {
        if (!iban || !bic || !accountholder) reject();

      } else if (type === 'credit') {
        if (!number || !exp_month || !exp_year || !cvc || !cardholder) reject();

      }

      window.paymill.createToken(payment, (err, res) => {
        payment.token = !err
        ? res.token
        : '';

        resolve(payment);
      });
    })
  }
};
