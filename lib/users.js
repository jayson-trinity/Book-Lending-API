const fileUtil = require('./fileUtil');
const users = {};
users.Users = (data, callback) => {
  const acceptableHeaders = ["post", "get", "put", "delete"];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    users.$users[data.method](data, callback);
  } else {
    callback(405);
  }
};

//main user route object
users.$users = {};

//Post route -- for creating a user
users.$users.post = (data, callback) => {
  //validate that all required fields are filled out
  var firstname = typeof (data.payload.firstname) === 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname : false;
  var lastname = typeof (data.payload.lastname) === 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname : false;
  var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 ? data.payload.email : false;
  var password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;

  
  if (firstname && lastname && email && password) {
    fileUtil.create('users', email, data.payload, (err) => {
      if (!err) {
        callback(200, { message: "user added successfully", data: null });
      } else {
        callback(400, { message: "could not add user" });
      }
    });
  }else{
    callback(400, { message: "Some fields are incorrect" });
  }
};

//Get route -- for geting a user
users.$users.get = (data, callback) => {
  if (data.query.id) {
    fileUtil.read('users', data.query.id, (err, data) => {
      if (!err && data) {
        callback(200, { message: 'user retrieved', data: data });
      } else {
        callback(404, { err: err, data: data, message: 'could not retrieve user' });
      }
    });
  } else {
    callback(404, { message: 'user not found', data: null });
  }
};

//Put route -- for updating a user
users.$users.put = (data, callback) => {
  if (data.query.id) {
    fileUtil.update('users', data.query.id, data.payload, (err) => {
      if (!err) {
        callback(200, { message: 'user updated successfully' })
      } else {
        callback(400, { err: err, data: null, message: 'could not update user' });
      }
    });
  } else {
    callback(404, { message: 'user not found' });
  }
};

//Delete route -- for deleting a user
users.$users.delete = (data, callback) => {
  if (data.query.id) {
    fileUtil.delete('users', data.query.id, (err) => {
      if (!err) {
        callback(200, { message: 'user deleted successfully' });
      } else {
        callback(400, { err: err, message: 'could not delete user' });
      }
    })
  } else {
    callback(404, { message: 'user not found' });
  }
};

module.exports = users;