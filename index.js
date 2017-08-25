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
  function EcSdk(baseURL, storeID) {
    _classCallCheck(this, EcSdk);

    _axios2.default.defaults.baseURL = baseURL;
    _axios2.default.defaults.withCredentials = true;
    _axios2.default.defaults.headers.common['store-id'] = storeID;
  }

  //
  //
  //
  // helpers
  //
  //
  //

  _createClass(EcSdk, [{
    key: 'ObjectToStringNoQuotes',
    value: function ObjectToStringNoQuotes(object) {
      return JSON.stringify(object).replace(/\"([^(\")"]+)\":/g, "$1:");
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

  }, {
    key: 'fetchAllProducts',
    value: function fetchAllProducts() {
      var query = 'query{\n      products {\n        id\n        name\n        image_url\n      }\n    }';

      return this.get(query);
    }

    // fetch on single product

  }, {
    key: 'fetchSingleProduct',
    value: function fetchSingleProduct(id) {
      var query = 'query{\n      products(prodId: "' + id + '") {\n        id\n        name\n        image_url\n      }\n    }';

      return this.get(query);
    }

    /*****     Cart      *****/

  }, {
    key: 'getCart',
    value: function getCart() {
      var query = 'query{\n      cart {\n        id\n        quantity\n        value {\n          amount\n          currency\n        }\n      }\n    }';

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
    value: function addToCart(id) {
      var mutation = 'mutation{\n      cart (productId:"' + id + '") {\n        quantity\n        id\n      }\n    }';

      return this.post(mutation);
    }

    // checkout

  }, {
    key: 'checkoutCart',
    value: function checkoutCart(coData) {
      var customer = coData.customer,
          billing = coData.billing,
          shipping = coData.shipping,
          payment = coData.payment;

      if (!coData || !customer || !billing || !shipping || !payment) return false;

      var mutation = 'mutation{\n      checkout (\n        customer:' + this.ObjectToStringNoQuotes(customer) + ',\n        billing_address:' + this.ObjectToStringNoQuotes(billing) + ',\n        shipping_address:' + this.ObjectToStringNoQuotes(shipping) + ',\n        payment:' + this.ObjectToStringNoQuotes(payment) + '\n      )\n    }';

      return this.post(mutation);
    }

    // univsersal http POST request

  }, {
    key: 'post',
    value: function post(query) {
      return _axios2.default.post('/', { query: query });
    }
  }]);

  return EcSdk;
}();

exports.default = EcSdk;
;
module.exports = exports['default'];
