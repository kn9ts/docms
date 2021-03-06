# DOCMS
#### CLI Document Management System resting on RESTful server

[![Coverage Status](https://coveralls.io/repos/kn9ts/docms/badge.svg?branch=master&service=github)](https://coveralls.io/github/kn9ts/docms?branch=master)
[![Build Status](https://semaphoreci.com/api/v1/projects/fdd7259e-e922-4ef7-b4c2-fc2b42cdb420/638214/shields_badge.svg)](https://semaphoreci.com/kn9ts/docms)

The system manages documents, users and user roles. Each document defines access rights;
the document defines which roles can access it. Also, each document specifies the date it was published.

Users are categorized by roles. Each user must have a role defined for them.

## Installation
Open up your Terminal and clone this repo or download it to your machine:
```bash
$ git clone https://github.com/kn9ts/docms.git
```

[Click here](https://github.com/kn9ts/docms/archive/master.zip) to download.

#### Global dependencies

Please make sure you have installed `bower` and `gulp` globally. This applications depends heavily on both of these packages.

```bash
$ sudo npm install -g bower gulp
```

While you are it, it would be great if you installed `mocha, karma and karma-cli` globally if you intend to run the tests.

```bash
$ sudo npm install -g mocha karma karma-cli
```

__NOTE:__ For global dependencies you may have to use `sudo` before the commands as demonstrated above

#### Dependencies
Once cloned or download(and unzipped), enter the directory and install all dependencies by running:

Backend dependencies:

```bash
$ npm install
```

Front-end dependencies:

```bash
$ bower install
```

#### Seeding
Once the dependencies have been installed, you have to seed the database with roles,
a user and a few documents allegedly created by the user.

```bash
$ node seeds/roles.js
$ node seeds/user.js
$ node seeds/documents.js
```

#### ENV File

You need an `.env` file where the application can pick `ENV` configurations before booting up.

There is an example `.env` file by the name `.env.example` that can be used.
You will have to rename the ENV file to `.env`

Run this quick command to do so:

```
$ mv .env.example .env
```

Now the app is ready to be used.

## Usage

From the command line run the command below,
and open the browser at [http://localhost:3000](http://localhost:3000):

```
$ gulp
```
---

## Testing
To run the tests in the `tests/` folder, both front-end and backend.
Make sure you have mocha and karma are installed globally.

```bash
$ sudo npm i -g mocha karma karma-cli
```

Then run:

```bash
$ npm test
```

__(c) 2015. Made with :heart: by Eugene Mutai. #TIA__
