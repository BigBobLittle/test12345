const { default: axios } = require("axios");
const functions = require("firebase-functions");
const bcrypt = require("bcryptjs");
const { db } = require("../config");

const createNewUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(422).send({
      error: true,
      message: "Please provide phone number and password to create account",
    });
  }

  try {
    const createUser = await db.collection("users").add({
      phoneNumber,
      password: await bcrypt.hash(password, 10),
    });

    return res.status(201).json({
      success: true,
      message: "User account successfully created",
      createUser,
    });
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
};

const web3 = async (req, res) => {
  const options = {
    url: `https://mainnet.infura.io/v3/${functions.config().infura.key}`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",true], "id":1}',
  };

  try {
    const { data } = await axios.post(options.url, options.data, {
      ...options.headers,
    });
    return res.json({ hash: data.result.hash });
  } catch (error) {
    res.status(400).send("Something went wrong, please try again later");
  }
};

module.exports = {
  createNewUser,
  web3,
};
