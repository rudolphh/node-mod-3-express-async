const express = require('express');
const fetch = require('node-fetch');
const request = require('request');

const app = express();
const port = 3000;

// Question 1 - Part 1
let employees = require('./data/employees.json').employees;
let projects = require('./data/projects.json').projects;

// Question 1 - Part 2
app.get('/employee/:id', (req, res) => {
    let id = req.params.id;
    let employee = employees.find(employee => employee.id == id);
    res.json(employee);
});

app.get('/project/:id', (req, res) => {
    let id = req.params.id;
    let project = projects.find(project => project.projectId == id);
    res.json(project);
});

// Question 1 - Part 3

// using fetch and promise
app.get('/getEmployeeDetails/:id', (req, res) => {

    let id = req.params.id;
    let empUrl = 'http://localhost:3000/employee/' + id;

    fetch(empUrl).then(res => res.json())
    .then(employee => {
        return fetch('http://localhost:3000/project/' + employee.projectId)
        .then(res => res.json())
        .then(project => {
            delete employee.projectId;
            employee.project = project;
            return employee;
        });
    })
    .then(employee => {
        res.send(employee);
    });

});

app.get('/getemployeedetails', (req, res) => {
    let empArray = require('./data/employees.json').employees;
    let projArray = require('./data/projects.json').projects;

    empArray.forEach(element => {
        let proj = projArray.find(project => project.projectId == element.projectId);
        delete element.projectId;
        element.project = proj;
    });

    res.send(empArray);    
});


// Question 2 - Part 1
let mockApiUrl = 'http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees';

app.get('/employees', (req, res) => {
    req.pipe(request.get(mockApiUrl)).pipe(res);
});


app.listen(port, (err) => {
    if(err) throw err;
    console.log(`server running on port ${port}`);
});