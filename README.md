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
  <p>To start the project, run the following command:</p>

  <pre><code>npm start</code></pre>

  <p>The application should now be running on <code>http://localhost:3000</code>.</p>
