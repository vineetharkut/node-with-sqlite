const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const sqlite = require('sqlite3');
const app = express();

// Connecting the database
const db = new sqlite.Database('./node-with-sqlite.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

// Setting the templating engine
app.set('view engine','hbs');

app.use(bodyParser.urlencoded({extended:false}));
const port = process.env.PORT || 3000 ;

// Creating the table
app.get('/create-table',(req,res,next) => {
	db.run('CREATE TABLE employee(id INTEGER PRIMARY KEY,name TEXT,designation TEXT,qualification TEXT)');
});

// Inserting the Records
app.get('/insert-records',(req,res,next) => {
  db.run(`INSERT INTO employee(id,name,designation,qualification) VALUES(?,?,?,?)`, ['4','Vineet','SE','MCA'], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run(`INSERT INTO employee(id,name,designation,qualification) VALUES(?,?,?,?)`, ['5','Pankaj','Manager','MBA'], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run(`INSERT INTO employee(id,name,designation,qualification) VALUES(?,?,?,?)`, ['6','Deba','Lead','M.Tech.'], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
});

// Updating the Records by Id with updated name
app.get('/update-records/:id/:name',(req,res,next) => {
	//res.send(req.params.id);
	name = req.params.name ;
	id = req.params.id ;
	db.all("update employee set name = '"+name+"' where id = "+id,(err,results) => {
		console.log("Update Error Message ",err);
	});
	db.all('select * from employee',(err,results) => {
		console.log("Fetching Error Message ",err);
		console.log(results);
		res.render('index',{userQuery: req.body.query,employeeList : JSON.stringify(results)});
	});
});

// Deleting the Records by Id
app.get('/delete-records/:id',(req,res,next) => {
	//res.send(req.params.id);
	name = req.params.name ;
	id = req.params.id ;
	db.all("delete from employee where id = "+id,(err,results) => {
		console.log("Delete Error Message ",err);
	});
	db.all('select * from employee',(err,results) => {
		console.log("Fetching Error Message ",err);
		console.log(results);
		res.render('index',{userQuery: req.body.query,employeeList : JSON.stringify(results)});
	});
});

// Home
app.get('/',(req,res,next) => {
	db.all('select * from employee',(err,results) => {
		if(err){
			console.log(err);
			return false ;	
		}
		console.log(results);
		res.render('index',{employeeList : JSON.stringify(results,undefined,true)});
	});
});

/*
// Disconnecting/Closing the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});*/

app.listen(port,() => console.log(`listening at port ${port}`));