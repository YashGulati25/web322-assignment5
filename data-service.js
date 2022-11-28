const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "cnglhfvh",
  "cnglhfvh",
  "8A9RbshbR9htDRlTYvAEF8fYPCreYPPq",
  {
    host: "lucky.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

// Define a "Student" model

const Student = sequelize.define("Student", {
  studentID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
  },
  addressStreet: {
    type: Sequelize.STRING,
  },
  addressCity: {
    type: Sequelize.STRING,
  },
  addressState: {
    type: Sequelize.STRING,
  },
  addressPostal: {
    type: Sequelize.STRING,
  },
  isInternationalStudent: {
    type: Sequelize.BOOLEAN,
  },
  expectedCredential: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
  registrationDate: {
    type: Sequelize.STRING,
  },
});

const Program = sequelize.define("Program", {
  programCode: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  programName: {
    type: Sequelize.STRING,
  },
});

Program.hasMany(Student, { foreignKey: "program" });

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(function () {
        console.log("Connection has been established successfully.");
        resolve();
      })
      .catch(function (err) {
        console.log("Unable to connect to the database:", err);
        reject("Unable to sync the database");
      });
    //   sequelize.sync();
  });
};

module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.addStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    // set correct values
    studentData.isInternationalStudent = studentData.isInternationalStudent
      ? true
      : false;

    //convert empty values to null
    for (const key in studentData) {
      if (studentData[key] === "") {
        studentData[key] = null;
      }
    }

    Student.create({ ...studentData })
      .then(() => {
        resolve("Student created succesfully");
      })
      .catch(() => {
        reject("unable to create student");
      });
  });
};

module.exports.updateStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    // set correct values
    studentData.isInternationalStudent = studentData.isInternationalStudent
      ? true
      : false;

    //convert empty values to null
    for (const key in studentData) {
      if (studentData[key] === "") {
        studentData[key] = null;
      }
    }

    Student.update(
      { ...studentData },
      {
        where: {
          studentID: studentData.studentID,
        },
      }
    )
      .then(() => {
        resolve("Student updated successfully");
      })
      .catch(() => {
        reject("unable to update student");
      });
  });
};

module.exports.getStudentById = function (id) {
  return new Promise(function (resolve, reject) {
    Student.findAll({ where: { studentID: id }, limit: 1 })
      .then((data) => {
        resolve(data[0]);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getStudentsByStatus = function (status) {
  return new Promise(function (resolve, reject) {
    Student.findAll({ where: { status } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getStudentsByProgramCode = function (program) {
  return new Promise(function (resolve, reject) {
    Student.findAll()
      .then((data) => {
        resolve(data.filter((student) => student.program === program));
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getStudentsByExpectedCredential = function (credential) {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        expectedCredential: credential,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getInternationalStudents = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        isInternationalStudent: true,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPrograms = function () {
  return new Promise(function (resolve, reject) {
    Program.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.addProgram = function (programData) {
  return new Promise(function (resolve, reject) {
    //convert empty values to null
    for (const key in programData) {
      if (programData[key] === "") {
        programData[key] = null;
      }
    }

    Program.create({ ...programData })
      .then(() => {
        resolve("Program created successfully");
      })
      .catch(() => {
        reject("unable to create Program");
      });
  });
};

module.exports.updateProgram = function (programData) {
  return new Promise(function (resolve, reject) {
    //convert empty values to null
    for (const key in programData) {
      if (programData[key] === "") {
        programData[key] = null;
      }
    }

    Program.update(
      { ...programData },
      { where: { programCode: programData.programCode } }
    )
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to update Program");
      });
  });
};

module.exports.getProgramByCode = function (pcode) {
  return new Promise(function (resolve, reject) {
    Program.findAll({ where: { programCode: pcode }, limit: 1 })
      .then((data) => {
        resolve(data[0]);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.deleteProgramByCode = function (pcode) {
  return new Promise(function (resolve, reject) {
    Program.destroy({ where: { programCode: pcode } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to deleted program");
      });
  });
};

module.exports.deleteStudentById = function (id) {
  return new Promise(function (resolve, reject) {
    Student.destroy({ where: { studentID: id } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to deleted student");
      });
  });
};
