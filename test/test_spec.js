var request = require("request");
var base_url = "http://localhost:4000/";
var server = require("../app.js");


// sample unit test begin
describe("Test Base Page", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get("http://localhost:4000/", function(error, response, body) {
        console.log("example")
        console.log(response)
        expect(response.statusCode).toBe(200);
        done();
        server.close()
      });
    });

  });
});
