const { default: axios } = require("axios");
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs")

const createNewUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    res.status(422).send({
      error: true,
      message: "Please provide phone number and password to create account",
    });
  }

 try {
    const createUser = await admin.auth().createUser({
      phoneNumber,
      password: await bcrypt.hash(password, 10),
    });

    return res.status(201).json({
      success: true,
      message: "User account successfully created",
      createUser,
    });
 } catch (error) {
   res.status(400).send("Something went wrong")
 }
};

const web3 = async (req, res) => {
  const dataString =
    '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",true], "id":1}';

  const options = {
    url: `https://mainnet.infura.io/v3/13f845cb660343af8ece470c1b937997`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: dataString,
  };

  try {
    const response = await axios(options);
    return res.json(response);
  } catch (error) {
    res.status(400).send("Something went wrong, please try again later");
  }
};

module.exports = {
  createNewUser,
  web3,
};
