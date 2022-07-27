const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');


tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const { tagName } = req.params;

    try {

        const allPosts = await getPostsByTagName(tagName);

        const posts = allPosts.filter(post => {
            if (post.active) {
                return true;
            }
            if (req.user && post.author.id === req.user.id) {
                return true;
            }
            return false;
        });

        res.send({ posts })

    } catch ({ name, message }) {
    }
  });



tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

module.exports = tagsRouter;