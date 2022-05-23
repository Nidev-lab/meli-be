require('dotenv').config()
const axios = require('axios');

const getProductList = async(req, res) => {
  const urlBase = process.env.URL_SEARCH
  const { q } = req.query;

  try {
    const resp = await axios(`${urlBase}/search?q=${q}`);

    const limitResp = resp.data.results.slice(0, 4);

    const author = {
      name: resp.data.name,
      lastname: resp.data.lastname
    };

    const categories = resp.data.filters[0].values[0].path_from_root.map(category => category.name);

    const items = limitResp.map(item => new Object({
      id: item.id,
      title: item.title,
      price: {
        currency: item.prices.prices[0].currency_id,
        amount: item.prices.prices[0].amount,
        decimals: item.prices.prices[0].regular_amount
      },
      picture: item.thumbnail,
      condition: item.condition,
      freeShipping: item.shipping.free_shipping,
      address: {
        state_name: item.address.state_name,
        city_name: item.address.city_name
      },
    }));

    const data = {
      author,
      categories,
      items,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(error);
  }
};

const getProductDetail = async(req, res) => {
  const urlBase = process.env.URL_ITEMS
  const { id } = req.params;

  try {
    const itemDetail = await axios(`${urlBase}/${id}`);
    const itemDescription = await axios(`${urlBase}/${id}/description`);

    const author = {
      name: itemDetail.data.name,
      lastname: itemDetail.data.lastname
    };

    const items = new Object({
      id: itemDetail.data.id,
      title: itemDetail.data.title,
      price: {
        currency: itemDetail.data.currency_id,
        amount: itemDetail.data.price,
        decimals: itemDetail.data.regular_amount,
      },
      picture: itemDetail.data.pictures[0].url,
      condition: itemDetail.data.condition,
      freeShipping: itemDetail.data.shipping.free_shipping,
      soldQuantity: itemDetail.data.sold_quantity,
      description: itemDescription.data.plain_text
    });

    const data = {
      author,
      items,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(error);
  }
}

module.exports = { getProductList, getProductDetail };
