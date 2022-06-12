const { default: axios } = require("axios");
const functions = require("firebase-functions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../config");

// create new user with phone number and password
const createNewUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(422).json({
      error: true,
      message: "Please provide phone number and password to create account",
    });
  }

  try {
    const createUser = db.collection("users").doc();

    const dataToSave = {
      phoneNumber,
      password: await bcrypt.hash(password, 10),
      id: createUser.id,
    };

    await createUser.set(dataToSave);
    return res.status(201).json({
      success: true,
      message: "User account successfully created",
      ...dataToSave,
    });
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
};

// login user

const loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return res.status(422).json({
      error: true,
      message: "Please provide phone number and password to create account",
    });
  }

  const findUser = await db
    .collection("users")
    .where("phoneNumber").isEqual(phoneNumber)
    .get();

  if (!findUser.exists) {
    return res.status(422).json({
      error: true,
      message: "Sorry user does not exists",
    });
  }

  // compare passwords
  const comparePasswords = await bcrypt.compare(password, findUser.password);
  if (!comparePasswords) {
    return res.status(422).json({
      error: true,
      message: "Passwords mismatch",
    });
  }

  // sign jwt
  const signToken = await jwt.sign(
    { id: findUser.id },
    `${functions.config().infura.key}`,
    "1h"
  );

  return res.status(200).json({
    error: false,
    message: "User login successful",
    data: signToken,
  });
};

// inject transaction and return hash
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
  loginUser,
};
