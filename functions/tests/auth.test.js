const request = require("supertest");
const baseUrl = "https://us-central1-kortana-test.cloudfunctions.net/app";

describe("test features", () => {
  describe("default route", () => {
    it("should test the default app route", async () => {
      const data = await request(baseUrl).get("/");
      expect(data.status).toBe(200);
      expect(data.body.message).toEqual("Hey there! DEPLOYED COMPLETE");
    });
  });

  describe("web3 endpoint", () => {
    it("should test /web3 endpoint and expect a hash returned", async () => {
      const { body } = await request(baseUrl).post("/web3");
      expect(body).toEqual(
        expect.objectContaining({ hash: expect.any(String) })
      );
    });
  });

  describe("createUser", () => {
    it("should  return error message when no data is passed to /createNewUser", async () => {
      const { body } = await request(baseUrl).post("/createUser").send({
        phoneNumber: "",
        password: "",
      });
      expect(body).toEqual(
        expect.objectContaining({
          error: expect.any(Boolean),
          message: "Please provide phone number and password to create account",
        })
      );
    });

    it("should create a user and return it", async () => {
      const data = {
        phoneNumber: "0543892565",
        password: "someDummyPassword",
      };
      const { body } = await request(baseUrl).post("/createUser").send(data);

      expect(body).toEqual(
        expect.objectContaining({
          success: expect.any(Boolean),
          message: "User account successfully created",
          id: expect.any(String),
          password: expect.any(String),
          phoneNumber: data.phoneNumber,
        })
      );
    }, 10000);
  });

  describe("login user", () => {
    it("should  return error message when no data is passed to /login", async () => {
      const { body } = await request(baseUrl).post("/login").send({
        phoneNumber: "",
        password: "",
      });
      expect(body).toEqual(
        expect.objectContaining({
          error: expect.any(Boolean),
          message: "Please provide phone number and password to create account",
        })
      );
    });

    // it("should login a user and return jwt", async () => {
    //   const { body } = await request(baseUrl).post("/login").send({
    //     phoneNumber: "0543892565",
    //     password: "someDummyPassword",
    //   });

    //   expect(body).toEqual(
    //     expect.objectContaining({
    //       error: expect.any(Boolean),
    //       message: "User login successful",
    //     })
    //   );
    // });
  });
});
