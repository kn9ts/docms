# DOCMS
#### CLI Document Management System resting on RESTful server

[![Coverage Status](https://coveralls.io/repos/kn9ts/docms/badge.svg?branch=feature%2Fdashboard&service=github)](https://coveralls.io/github/kn9ts/docms?branch=feature%2Fdashboard)

The system manages documents, users and user roles. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published.

Users are categorized by roles. Each user must have a role defined for them.

## Installation
Open up your Terminal and clone this repo or download it to your machine:
```bash
$ git clone https://github.com/kn9ts/docms.git
```

[Click here](https://github.com/kn9ts/docms/archive/master.zip) to download.

#### Dependencies
Once cloned or download(and unzipped), enter the directory and install all dependencies by running:

```bash
$ npm install
$ bower install
```

#### Seeding
Once the dependencies have been installed, you have to seed the database with roles, a user and a few documents allegedly created by the user.

```bash
$ node seeds/roles.js
$ node seeds/user.js
$ node seeds/documents.js
```

The seeding has not been perfected but `works` well. Wait for a second before pressing `CTRL + C` to terminate the process. Seeding is done in mere microseconds so terminating the app does not affect anything.

Now the app is ready to be used.

## Usage

from the command line run the command below, and open the browser at [http://localhost:3333](http://localhost:3333):

```
$ gulp
```
---

## Testing
To confirm the REST API is working. You could run the tests in the `tests/` folder. Make sure you have mocha installed globally first.

```bash
$ npm i mocha -g
```

Then run:

```bash
$ npm test
```

__(c) 2015. Made with <3 by Eugene Mutai. #TIA__
