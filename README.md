<h1>GradeHub : GradeBook API</h1>
<h2>Prerequisites</h2>
<p>Before running this project, ensure that you have the following installed:</p>
<ul>
<li><a href="https://nodejs.org">Node.js</a>: Make sure you have Node.js installed on your machine.</li>
</ul>
<p>Also have Nodemon installed globally. To install, you can follow these steps:</p>
<ol><li>Open your command prompt or terminal</li>
   <li>Runthe following command to install Nodemon globally using npm</li>
</ol>
   <pre><code>npm install -g nodemon</code></pre>
<p>If you are using a Unix-based system (e.g., macOS, Linux), you might need to use <code>sudo</code>:</p>

  <pre><code>sudo npm install -g nodemon</code></pre>

<h2>Getting Started</h2>
   <ol>
    <li>Clone this repository.</li>
    <li>Install project dependencies by running <code>npm install</code>.</li>
    <li>Create an `.env` file in the root directory of the project.</li>
    <li>In the `.env` file, define the following variables:</li>
  </ol>

  <pre><code>
    MONGO_URI=mongodb://your-mongodb-uri
    SECRET=your-secret-key
  </code></pre>

  <p>Replace <code>mongodb://your-mongodb-uri</code> with your actual MongoDB connection URI, and <code>your-secret-key</code> with your desired secret key for authentication.</p>

  <h2>Running the Project</h2>
  <p>To start the projec with dev mode , run the following command:</p>

  <pre><code>npm run dev</code></pre>

   <p>To start the projec without dev mode , run the following command:</p>

  <pre><code>npm start</code></pre>

  <p>The application should now be running on <code>http://localhost:3000</code>.</p>

<h2>API Requests in Postman</h2>
<p>To make an API request using Postman:</p>
<ol>
  <li>Open Postman and make sure your server is running locally on <code>http://localhost:3000</code>.</li>
  <li>Select the HTTP method as <strong>POST</strong>.</li>
  <li>Enter the request URL as <code>http://localhost:3000/teachers</code>.</li>
  <li>Set the request headers:</li>
</ol>
<pre><code>
Content-Type: application/json
</code></pre>
<p>In the request body, select the <strong>raw</strong> option and choose <strong>JSON</strong> from the dropdown.</p>
<p>Enter the following JSON object as the request body:</p>
<pre><code>{
  "first_name": "arthur",
  "last_name": "bernier",
  "email": "arthurb@gmail.com",
  "username": "arthurb",
  "password": "test123",
  "subject": "SEI"
}</code></pre>
<p>Click the <strong>Send</strong> button to submit the request.</p>

<h2>Running Tests</h2>
<p>To run the tests:</p>
<ol>
  <li>Ensure the app is not running.</li>
  <li>Execute the following command:</li>
</ol>

<pre><code>npm test</code></pre>

<h2>Running Load Tests</h2>
<p>To run load tests:</p>
<ol>
  <li>Ensure the app is running.</li>
  <li>Execute the following command:</li>
</ol>

<pre><code>npm run load</code></pre>

<h2>Wireframes</h2>
<p>Below are wireframes for the project:</p>
<h3>Wireframe 1</h3>
  <img src="assets/LandingPage.png" alt="Landing Page">

  <h3>Wireframe 2</h3>
  <img src="assets/teacher-dashboard1.png" alt="Teacher Dashboard">

  <h3>Wireframe 3</h3>
  <img src="assets/sign-up-page1.png" alt="Sign up page">

  <h3>Wireframe 4</h3>
  <img src="assets/update-page.png" alt="Update page">

  <h3>ERD Diagram</h3>
  <img src="assets/models.PNG" alt="ERD Diagram">

  <p>For more detailed wireframes and project planning, please refer to my <a href="https://trello.com/b/SDgT0nLh/grade-book-api">Trello board</a>.</p>
