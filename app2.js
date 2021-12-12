//router part

const express = require('express');
const pool = require('./database');
const cors = require('cors');
const app = express();
const port = 3000;


// register the ejs view engine
app.set('view engine', 'ejs');

//without this middleware, we cannot use data submitted by forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static('public'));

app.listen(port, () => {
    //passing variables to string with ${}
    console.log(`Server is listening to port ${port}`)
});


//controller part?
//http://localhost:3000
app.get('/', async (req, res) => {
    try {
        console.log("get posts request has arrived");

        const fetched = await pool.query(
            "SELECT * FROM posts"
        );
        res.render('posts', { fetched: fetched.rows, title: 'Home' });

    } catch (err) {
        console.error(err.message);
    }
});

//http://localhost:3000/posts
app.get('/posts', async (req, res) => {
    try {
        console.log("get posts request has arrived");
        const fetched = await pool.query(
            "SELECT * FROM posts ORDER BY id ASC"
        );
        res.render('posts', { fetched: fetched.rows, title: 'Home' });

    } catch (err) {
        console.error(err.message);
    }
});

//http://localhost:3000/singlepost/37
app.get('/singlepost/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.params.id);
        console.log("get a single post request has arrived");
        const fetched = await pool.query(
            "SELECT * FROM posts WHERE id = $1", [id]
        );
        res.render('singlepost', { fetched: fetched.rows[0], title: 'Post' });

    } catch (err) {
        console.error(err.message);
    }
});


/* app.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("get a post request has arrived");
        const Apost = await pool.query(
            "SELECT * FROM posts WHERE id = $1", [id]
        );
        res.json(Apost.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}); */


app.get('/contact', (req, res) => {
    //let kontakt = "hei mina siin";
    res.render('contact', { title: 'Contact Us' });
});


app.delete('/posts/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const post = req.body;
        console.log("delete a post request has arrived");
        const deletepost = await pool.query(
            "DELETE FROM posts WHERE id = $1", [id]
        );
        res.redirect('posts');
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/posts', async (req, res) => {
    try {
        const post = req.body;
        let random = Math.floor(Math.random() * 98) + 1;
        let number = random.toString();
        // let url = 'https://picsum.photos/1024/7' + number;
        let url = 'https://picsum.photos/id/10' + number + '/400/400';
        console.log(post);
        const fetched = await pool.query(
            "INSERT INTO posts(author, body, image1, image2, counter) values ($1, $2, $3, $4, $5) RETURNING * ", [post.titlex, post.bodyx, url, 'https://image.similarpng.com/very-thumbnail/2020/06/Like-button-blue-facebook-transparent-PNG.png', 0]
        );
        res.redirect('posts');
    } catch (err) {
        console.error(err.message)
    }
});

app.get('/posts/:id', async (req, res) => {
    try {
        console.log("upvote a post request has arrived");
        const { id } = req.params;
        console.log(req.params.id);
        const { counter } = req.body;
        const smth = await pool.query(
            "UPDATE posts SET counter = counter + 1 WHERE id = $1", [id]
        );

        /*        const fetched = await pool.query(
                   "SELECT * FROM posts"
               );
        
               res.render('posts', { fetched: fetched.rows, title: 'Home' });*/
        res.redirect('/posts');
    } catch (err) {
        console.error(err.message);
    }

});



app.get('/addnew', (req, res) => {
    res.render('addnewpost', { title: 'New' });
});
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error' });
});


