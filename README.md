# DOCMS
#### CLI Document Management System resting on RESTful server

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
```

#### Seeding
Once the dependencies have been installed, you have to seed the database with roles.

```bash
$ node seeds/roles.js
```

The seeding has not been perfected but `works` well. Wait for a second before pressing `CTRL + C` to terminate the process. Seeding is done in mere microseconds so terminating the app does not affect anything.

Now the app is ready to be used.

## Usage

You have to login before you can carry out any transactions/actions. Try `$ docs all` and you will be told you are `Unauthorised`.

So login 1st, this if you are signed up to the application.

##### Sign up
```bash
$ create -u eugene -p password -f Eugene -l Mutai -e eugenemutai@gmail.com
```
| You have to provide your username(-u), password(-p), first name(-f), last name(-l) and your email address(-e).

##### Login
```bash
$ login -u eugene -p password
```

---

### Actions you can carry out
Once logged in you there are a couple of actions avaible to carry out on the documents database.

##### Create
```bash
$ doc create 'content of the document' [--private]
```
*__NOTE:__* Once created. The document is added to the session and thus is the one persisted in the session. You can go ahead and update it.

##### Update
```bash
$ doc update 'content of the document'
```

If you want to update any other document, and not the one in session, you have to select it 1st. If do not remember the ID(dont expect you to), you can list all the documents and then get it's ID so as you can select it.

##### List all documents
```bash
$ doc(s) all
```

Example of results got: 
```
[id: 564dae1a9d9e1f2b54e7de96 creator:madisen_dickens] Labore quod adipisci aperiam praesentium dolores et expedita.
[id: 564dae92d1cda17754c0019e creator:kianna_bauch] Quaerat nulla distinctio voluptas sed labore corrupti unde dolor.
```

##### Select a document
Now you can go ahead and select the document you want to edit or delete. Please remember you can only carry out these actions if you the onwer/creator of the document).

```bash
$ select 564dae1a9d9e1f2b54e7de96
```

##### Update
Now go ahead and update it if you have the permission.

```bash
$ doc update 'content of the document'
```

You can also do this without selecting it by passing the ID of the document as an option
```bash
$ doc update 'content of the document' --id 564dae1a9d9e1f2b54e7de96
```

##### Update
Or delete it if you have permission.

```bash
$ doc delete
```

```bash
$ doc delete --id 564dae1a9d9e1f2b54e7de96
```

##### Document in session
You can check which document is in session
```bash
$ doc session
```

##### Search for a document
If you are looking for a specific document, maybe with a certain word you can search for it

```bash
$ doc search lorem
```

If found, a list will be shown as when you list all documents.

---

## Testing
To confirm the REST API is working. You could run the tests in the `tests/` folder. Make sure you have mocha installed globally first.

```bash
$ npm i mocha -g
```

Then run:

```bash
$ mocha tests/resources
```

(c) 2015. Made with <3 by Eugene Mutai. #TIA
