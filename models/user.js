const mongodb = require('mongodb');
const { getDb } = require('../database/mongoConnect');


class Users {
    constructor(
          firstName, lastName, email, gender, id, studentId, origin, department, courses, address, atClass
    ) {
        this.firstName = firstName;  
        this.lastName = lastName;
        this.email = email;  
        this.gender = gender;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.studentId = studentId;
        this.origin = origin;
        this.department = department;
        this.courses = courses;
        this.address = address;
        this.atClass = atClass;
    }


    // the static key enables me call getAllUsers directly on the class itself
    static getAllUsers() {
        const db = getDb();
        return db.collection('users')
        .find()
        .toArray()    
        .then(users => {
            return users;

        })
        .catch(err => {             
            console.log(err);
        });
    }

    saveToDB() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }
    
    static findById(Id) {
        const db = getDb();
        return db.collection('users')
        .find({_id: new mongodb.ObjectId(Id)})
        .next() 
        .then(user => {
          return user;
        })
        .catch(err => console.log(err))
    }

   
}

module.exports = Users;