/**
 NAME : ANOSIKE JAYSON
 PROJECT NAME: BOOK MANAGEMENT API (STRICTLY NODE JS).
 */

const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routeHandler = require('./lib/routehandler');
const users = require ('./lib/users');

const httpServer = http.createServer((req, res) => {
  //parse the incoming url
  const parsedurl = url.parse(req.url, true);
  //get the path name
  const pathname = parsedurl.pathname;
  const trimedPath = pathname.replace(/^\/+|\/+$/g, "");
  //get the Http Method
  const method = req.method.toLowerCase();
  //get the query string
  const queryStringObj = parsedurl.query;
  //get the request headers
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();


    const parsedPayload = buffer !== "" ? JSON.parse(buffer) : {};

    const data = {
      trimedPath: trimedPath,
      query: queryStringObj,
      method: method,
      headers: headers,
      payload: parsedPayload
    };

    const chosenHandler = typeof (router[trimedPath]) !== 'undefined' ? router[trimedPath] : router.notfound;
    //use the chosen handler to handle the request
    chosenHandler(data, (statusCode, result) => {
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200;
      result = typeof (res) === 'object' ? result : {};

      const responseObj = JSON.stringify(result);

      res.setHeader('Content-type', "application/json");
      res.writeHead(statusCode);

      res.write(responseObj);
      res.end();

      console.log(`the url visited was, ${trimedPath} and the method is ${method}`);
    });
  });
});

//start running on port 9080
httpServer.listen(9080, () => {
  console.log("server is running on port 9080");
});


const router = {
  ping: routeHandler.ping,
  books: routeHandler.Books,
  users:users.Users,
  notfound: routeHandler.notfound
}


