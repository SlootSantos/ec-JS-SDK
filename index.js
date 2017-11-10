'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EcSdk = function () {
  function EcSdk(baseURL, storeID, paymillPublicKey) {
    _classCallCheck(this, EcSdk);

    window.PAYMILL_PUBLIC_KEY = paymillPublicKey;

    _axios2.default.defaults.baseURL = baseURL;
    _axios2.default.defaults.withCredentials = true;
    _axios2.default.defaults.headers.common['store-id'] = storeID;
    _axios2.default.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
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


  _createClass(EcSdk, [{
    key: 'fetchAllProducts',
    value: function fetchAllProducts() {
      var query = 'query{\n      products {\n        id\n        cartId\n        name\n        image_url\n        description\n      }\n    }';

      return this.get(query);
    }

    // fetch on single product

  }, {
    key: 'fetchSingleProduct',
    value: function fetchSingleProduct(id) {
      var query = 'query{\n      products(prodId: "' + id + '") {\n        id\n        cartId\n        name\n        image_url\n        description\n      }\n    }';

      return this.get(query);
    }

    /*****     Cart      *****/

  }, {
    key: 'getCart',
    value: function getCart() {
      var query = 'query{\n      cart {\n        quantity\n        value {\n          amount\n          val_int\n          currency\n        }\n        items {\n          id\n          name\n          unit_price\n          quantity\n          value {\n            amount\n            currency\n          }\n        }\n      }\n    }';

      return this.get(query);
    }

    // univsersal http GET request

  }, {
    key: 'get',
    value: function get(query) {
      return _axios2.default.get('/', { params: { query: query } });
    }
  }, {
    key: 'addToCart',


    //
    //
    //
    // MUTATION
    //
    //
    //


    /*****     Cart      *****/

    // add to cart magic
    value: function addToCart(id, quantity) {
      var mutation = 'mutation{\n      addCart (productId:"' + id + '", quantity:"' + quantity + '") {\n        quantity\n        value {\n          amount\n          val_int\n          currency\n        }\n        items {\n          id\n          name\n          unit_price\n          quantity\n          value {\n            amount\n            currency\n          }\n        }\n      }\n    }';

      return this.post(mutation);
    }

    // remove from cart magic

  }, {
    key: 'removeFromCart',
    value: function removeFromCart(id, quantity) {
      var mutation = 'mutation{\n      removeCart (productId:"' + id + '", quantity: "' + quantity + '") {\n        quantity\n        items {\n          id\n          name\n          unit_price\n          quantity\n          value {\n            amount\n            currency\n          }\n        }\n      }\n    }';

      return this.post(mutation);
    }

    // checkout

  }, {
    key: 'checkoutCart',
    value: function checkoutCart(coData) {
      var _this = this;

      if (coData.payment.type === 'paypal') {
        this.paypalChecksumGeneration(coData.payment);
      } else {
        var customer = coData.customer,
            billing = coData.billing,
            shipping = coData.shipping,
            payment = coData.payment;

        if (!coData || !customer || !billing || !shipping || !payment) return false;

        this.checkPayment(payment).then(function (checkedPayment) {

          var mutation = 'mutation{\n          checkout (\n            type:' + _this.ObjectToStringNoQuotes(checkedPayment.type) + '\n            customer:' + _this.ObjectToStringNoQuotes(customer) + ',\n            billing_address:' + _this.ObjectToStringNoQuotes(billing) + ',\n            shipping_address:' + _this.ObjectToStringNoQuotes(shipping) + ',\n            payment:' + _this.ObjectToStringNoQuotes(checkedPayment) + '\n          )\n        }';

          return _this.post(mutation);
        });
      }
    }

    // univsersal http POST request

  }, {
    key: 'post',
    value: function post(query) {
      return _axios2.default.post('/', { query: query });
    }

    //
    //
    //
    // helpers
    //
    //
    //

  }, {
    key: 'ObjectToStringNoQuotes',
    value: function ObjectToStringNoQuotes(object) {
      return JSON.stringify(object).replace(/\"([^(\")"]+)\":/g, "$1:");
    }
  }, {
    key: 'paypalChecksumGeneration',
    value: function paypalChecksumGeneration(ppData) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var amount_int = ppData.amount_int,
            currency = ppData.currency,
            type = ppData.type;


        if (!amount_int || !currency) reject();

        var mutation = 'mutation{\n        paypal (\n          type:' + _this2.ObjectToStringNoQuotes(type) + '\n          amount:' + _this2.ObjectToStringNoQuotes(amount_int) + '\n          currency:' + _this2.ObjectToStringNoQuotes(currency) + '\n        ) {\n          token\n        }\n      }';

        _this2.post(mutation).then(function (res) {
          var chks = res.data.data.paypal.token;
          window.paymill.createTransaction({ checksum: chks });
        });
      });
    }
  }, {
    key: 'checkPayment',
    value: function checkPayment(payment) {
      return new Promise(function (resolve, reject) {
        var type = payment.type,
            first_name = payment.first_name,
            last_name = payment.last_name,
            accountholder = payment.accountholder,
            iban = payment.iban,
            bic = payment.bic,
            number = payment.number,
            exp_month = payment.exp_month,
            exp_year = payment.exp_year,
            cvc = payment.cvc,
            amount_int = payment.amount_int,
            currency = payment.currency;


        if (!amount_int || !currency || !type) reject();

        var fullName = first_name + last_name;

        if (type === 'sepa') {
          if (!iban || !bic || !accountholder) reject();
        } else if (type === 'credit') {
          if (!number || !exp_month || !exp_year || !cvc || !cardholder) reject();
        }

        window.paymill.createToken(payment, function (err, res) {
          payment.token = !err ? res.token : '';

          resolve(payment);
        });
      });
    }
  }]);

  return EcSdk;
}();

exports.default = EcSdk;
;
