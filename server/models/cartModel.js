const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

cartSchema.statics.createCart = async function (userID) {
  if (!userID) {
    throw Error("No user id supplied.");
  }
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    throw Error("Invalid user id.");
  }

  try {
    const cart = this.create({
      userID,
      cart: [],
    });
    return cart;
  } catch (e) {
    throw Error("Error creating cart.");
  }
};

cartSchema.statics.getCart = async function (userID) {
  if (!userID) {
    throw Error("No user id supplied.");
  }
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    throw Error("Invalid user id.");
  }

  const cart = await this.findOne({ userID: userID });

  if (!cart) {
    throw Error("Could not find user cart");
  }

  return cart;
};

cartSchema.statics.addToCart = async function (userID, productID) {
  if (!userID || !productID) {
    throw Error("Missing parameters.");
  }

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    throw Error("Invalid product id.");
  }

  const cart = await this.getCart(userID);

  if (cart.cart.find((item) => item.product == productID)) {
    throw Error("Item already in cart, go to cart to update quantity.");
  }

  cart.cart.push({ product: productID, quantity: 1 });

  return cart.save();
};

cartSchema.statics.updateCart = async function (userID, productID, quantity) {

  if (!userID || !productID || !quantity) {
    throw Error("Missing parameters.");
  }

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    throw Error("Invalid product id.");
  }

  if (quantity == 0) {
    return this.deleteFromCart(userID, productID);
  }

  const cart = await this.getCart(userID);

  const item = cart.cart.find((item) => item.product == productID);

  if (!item) {
    throw Error("Item not found in cart.");
  }

  item.quantity = quantity;

  return cart.save();

};

cartSchema.statics.deleteFromCart = async function (userID, productID) {
  if (!userID || !productID) {
    throw Error("Missing parameters.");
  }

  const cart = await this.getCart(userID);

  const item = cart.cart.indexOf(
    cart.cart.find((item) => item.product == productID)
  );

  if (item === -1) {
    throw Error("Item not found in cart.");
  }
  cart.cart.splice(item, 1);

  return cart.save();
};

cartSchema.statics.emptyCart = async function (userID) {
  if (!userID) {
    throw Error("No user id supplied.");
  }

  const cart = await this.getCart(userID);

  cart.cart = [];

  return cart.save();
};

module.exports = mongoose.model("Cart", cartSchema);