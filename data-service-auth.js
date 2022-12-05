const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

let User;

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://Yash:WR6XUrTlAv16rQYh@senecaweb.crkblud.mongodb.net/?retryWrites=true&w=majority"
    );

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    //compare passwords
    if (userData.password2 !== userData.password) {
      reject("Password's don't match");
    }

    bcrypt
      .hash(userData.password, 10)
      .then((hash) => {
        userData.password = hash;
        let newUser = new User(userData);

        newUser
          .save()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            if (err.code === 11000) {
              reject("Username already taken");
            } else {
              reject("There was an error creating the user:" + err);
            }
          });
      })
      .catch((err) => {
        console.log(err);
        reject("There was an error encrypting the password");
      });
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName })
      .exec()
      .then((users) => {
        if (users.length === 0) {
          reject(`Unable to find user: ${userData.userName}`);
        }

        bcrypt
          .compare(userData.password, users[0].password)
          .then((result) => {
            if (result === false) {
              reject(`Incorrect Password for user: ${userData.userName}`);
            }

            users[0].loginHistory.push({
              dateTime: new Date().toString(),
              userAgent: userData.userAgent,
            });

            User.updateOne(
              { userName: users[0].userName },
              { $set: { loginHistory: users[0].loginHistory } }
            ).exec();

            resolve(users[0]);
          })
          .catch((err) => {
            reject(`Error : ${err}`);
          });
      })
      .catch((err) => {
        reject(`There was an error verifying the user: ${err}`);
      });
  });
};
