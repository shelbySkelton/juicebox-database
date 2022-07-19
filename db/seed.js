const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  getAllPosts,
  createPost,
  updatePost,
  getPostsByUser,
  getUserById
} = require('./index');



async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({ username: 'albert', password: 'bertie99', name: 'albert', location: 'candyland'});
    await createUser({ username: 'sandra', password: '2sandy4me', name: 'sandra', location: 'narnia'  });
    await createUser({ username: 'glamgal', password: 'soglam', name: 'george', location: 'jupiter' });


    console.log("Finished creating users!");
  } catch(error) {
    console.error("Error creating users!");
    throw error;
  }
}



async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        location varchar(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);

    await client.query(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}


async function createInitialPosts() {

  try {
    const [albert, sandra, glamgal] = await getAllUsers()
    
    await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love reading them."
    });
    await createPost({
      authorId: sandra.id,
      title: "First Post",
      content: "Hi Sandra, It's Sandra. Do people still blog for fun anymore?"
    });
    await createPost({
      authorId: glamgal.id,
      title: "Hello World",
      content: "Greetings Glamworld, Glamgirl up in here. I miss tumblr...."
    });
  } catch (error) {
    throw error;
  }

}



async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
      console.log("Starting to test database...");

      console.log("Calling getAllusers")
    const users = await getAllUsers();
      console.log("getAllUsers:", users);

      console.log('Calling updateUser on users[0]')
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
      console.log('UpdateUserResult:', updateUserResult);

      console.log('Calling getAllPosts...')
    const posts = await getAllPosts();
      console.log("getAllPosts result:", posts);

      console.log("Calling updatePost on posts[0]..")
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
      console.log("updatePostResult: ", updatePostResult)

      console.log("Calling getUserById with 1")
    const albert = await getUserById(1);
      console.log("getUserById result: ", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());