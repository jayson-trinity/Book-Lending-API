/*
USE : 
to rent a book => /books?rent="book name"
to return a book => /books?return="book name"
*/


const fileUtil = require('./fileUtil');
const routeHandler = {};
routeHandler.Books = (data, callback) => {
  const acceptableHeaders = ["post", "get", "put", "delete","patch"];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    if(data.method == 'get' && data.query.rent){
      routeHandler._books.borrow(data, callback);
    }else {
      routeHandler._books[data.method](data, callback);
    }
   
  } else {
    callback(405);
  }
};

//main book route object
routeHandler._books = {};

//Post route -- for creating a book
routeHandler._books.post = (data, callback) => {
  //validate that all required fields are filled out
  var name = typeof (data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
  var price = typeof (data.payload.price) === 'string' && data.payload.price.trim().length > 0 ? data.payload.price : false;
  var copies = typeof (data.payload.copies) === 'number' && parseInt(data.payload.copies) ? data.payload.copies : false;
  var author = typeof (data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
  var publisher = typeof (data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
  
  if (name && price && copies && author && publisher) {
    fileUtil.create('books', name, data.payload, (err) => {
      if (!err) {
        callback(200, { message: "book added successfully", data: null });
      } else {
        callback(400, { message: "could not add book" });
      }
    });
  }else{
    callback(400, { message: "Some fields are incorrect" });
  }
};

//Get route -- for geting a book
routeHandler._books.get = (data, callback) => {
  if (data.query.name) {
    fileUtil.read('books', data.query.name, (err, data) => {
      if (!err && data) {
        callback(200, { message: 'book retrieved', data: data });
      } else {
        callback(404, { err: err, data: data, message: 'could not retrieve book' });
      }
    });
  } else {
    callback(404, { message: 'book not found', data: null });
  }
};

//Put route -- for updating a book
routeHandler._books.put = (data, callback) => {
  if (data.query.name) {
    fileUtil.update('books', data.query.name, data.payload, (err) => {
      if (!err) {
        callback(200, { message: 'book updated successfully' })
      } else {
        callback(400, { err: err, data: null, message: 'could not update book' });
      }
    });
  } else {
    callback(404, { message: 'book not found' });
  }
};


//borrow route -- for renting a book
routeHandler._books.borrow = (reqData, callback) => {
  if (reqData.query.rent) {
    fileUtil.read('books', reqData.query.rent, (err,data) => {
     
      if (!err,data) {
          if (data.copies < 1) {
            callback(200, {message: 'Book is out of stock', data: null});
          } else {
            data.copies -= 1;
            const stringData = JSON.stringify(data);
            fileUtil.borrow('books', reqData.query.rent, stringData, (err) => {
              if (!err) {
                callback(200, {message : "book borrowed successfully", data: data})
              } else {
                callback(400, { messsage: 'could not borrow book'})
              }
            });
          }
        callback(200, {message:'book borrowed', data: data});
      } else {
        callback(404, {err: err, data: data, message:'could not borrow book'});
      }
    });
  }
}  

// return Route -- for returning borrowed book
routeHandler._books.patch = (reqData, callback) => {
  if (reqData.query.return) {
    fileUtil.read('books', reqData.query.return, (err,data) => {
      if (!err,data) {
           if (data.copies < 1) {
            callback(200, {message: 'Book is out of stock', data: null});
          } else {
            data.copies += 1;
            const stringData = JSON.stringify(data);
            fileUtil.borrow('books', reqData.query.return, stringData, (err) => {
              if (!err) {
                callback(200, {message : "book returned successfully", data: data})
              } else {
                callback(400, { messsage: 'could not return book'})
              }
            });
          }
        callback(200, {message:'book returned', data: data});
      } else {
        callback(404, {err: err, data: data, message:'could not return book'});
      }
   });
  }
}  

      
//Delete route -- for deleting a book
routeHandler._books.delete = (data, callback) => {
  if (data.query.name) {
      fileUtil.delete('books', data.query.name, (err) => {
          if (!err) {
              callback(200, { message: 'book deleted successfully' });
          } else {
              callback(400, { err: err, message: 'could not delete book' });
          }
      })
  } else {
      callback(404, { message: 'book not found' });
  }
};

routeHandler.ping = (data, callback) => {
  callback(200, { response: "server is live" });
};

routeHandler.notfound = (data, callback) => {
  callback(404, { response: 'not found' });
};


module.exports = routeHandler;
