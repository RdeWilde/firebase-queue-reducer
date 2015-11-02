# firebase-queue-reducer 

![build status](https://travis-ci.org/trialbee/firebase-queue-reducer.svg?branch=master)

This is a simple wrapper around [firebase-queue](https://github.com/firebase/firebase-queue) that abstract a data manipulation pipeline from one tasks queue to another.

## The problem we try to solve here:

Say you have some raw json documents that you want to refine and you want to split the manipulation logic among different processes:

	// raw documment:
	{ name: 'Marco', surname: 'Peg', birthDate: 19810630 }
	
Now I want to compute the information `age` from the raw document and remove the birthdate because is not really relevant to my project:
	
	// resulting document
	{ name: 'Marco', surname: 'Peg', age: 34 }
	
At this point I want to compute the `fullName` property instead of the two distinct values, the resulting document will look like:
	
	// resulting document
	{ fullName: 'Marco Peg', age: 34 }
	
The idea is to **split each transformation logic into a simple script** and use [Firebase](https://www.firebase.com/) as _message bus_ to coordinate the transformation.

## Define the reducers:

You need 3 queues of documents to handle that:

- raw (original documents)
- step1 (age)
- step2 (name)

Each document will move from `raw -> step1` and from `step1 -> step2` and each process can be represented as a _reducing function_:

	function reduceAge(data) {
		return new Promise(function(resolve, reject) {
			resolve({
				name: data.name,
				surname: data.surname,
				age: computeCurrentAge(data.birthDate)
			});
		});
	}
	
	function reduceName(data) {
		return new Promise(function(resolve, reject) {
			resolve({
				fullName: [data.name, data.surname].join(' '),
				age: data.age
			});
		});
	}
	
> _reducing functions_ must return a _Promise_ so to be able to handle asynchronous
> tasks.

## Setup the services

At this point we can start playing with _NodeJS_ and define the two services that will use the already defined reducers:

	// step1.js:
	var fb = require('./my-local-firebase-instance');
	require('firebase-queue-reducer')({
		source: fb.child('raw'),
		target: fb.child('step1'),
		reducer: reduceAge
	});
	
	// step2.js
	var fb = require('./my-local-firebase-instance');
	require('firebase-queue-reducer')({
		source: fb.child('step1'),
		target: fb.child('step2'),
		reducer: reduceName
	});
	
## Running the pipeline

At this point you can run those two services and start feeding the `raw/tasks` data endpoint with documents. The pipeline will work out the reducing logic and the final documents will land into `step1/tasks`.

You can set up as many reducing steps you want keeping each setp as a standalone application. Each app focuses on the reducer function which should be carefully tested.

Because each reducing service will subscribe to the `source` queue and push to the `target` queue thei are completely independent from each other. Each process can fail and be rebooted withouth affect the others.


## Install

	npm install firebase-queue-reducer
	
## Config Options

### source, dest

FirebaseQueue end points.

### reducer

A function that receive a `task data` from the `source` queue and return a `Promise`.

If the promise **resolve** then the reduced document is pushed to the `dest/tasks` data endpoint.

If the promise **reject** the original document is pushed to `source/errors` for further analisys and debug.

### workers

Provide an integer number to tell the queue how many workers to run.


	


