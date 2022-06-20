// jshint esversion: 6

const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//////////////////// Request Targeting all articles ////////////////////

app.route("/articles")
    .get(function(req, res){
        Article.find({}, function(err, foundArticles){
            if(err){
                res.send(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(err){
                res.send(err);
            } else {
                res.send("Successfully added a new article!");
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany({}, function(err){
            if(err){
                res.send(err);
            } else {
                res.send("Successfully deleted all articles!");
            }
        });
    });

//////////////////// Request Targeting a specific article ////////////////////

app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No article matching that title was found!");
            }
        });
    })

    .put(function(req, res){
        Article.update(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Successfully updated article!");
                }
            }
        );
    })

    .patch(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated article!");
                }
            }
        );
    })

    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted article!");
                }
                else{
                    res.send(err);
                }
            }
        );
    });
     


// app.get("/articles", function(req, res) {
//     Article.find({}, function(err, foundArticles) {
//         if(!err) {
//             res.send(foundArticles);
//         }
//         else {
//             res.send(err);
//         }
//     });
// });

// app.post("/articles", function(req, res) {
//     // console.log(req.body.title);
//     // console.log(req.body.content);
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save(function(err) {
//         if(!err) {
//             res.send("Successfully added a new article!");
//         }
//         else {
//             res.send(err);
//         }
//     });
// });

// app.delete("/articles/:id", function(req, res) {
//     Article.deleteMany({},function(err) {
//         if(!err) {
//             res.send("Successfully deleted all articles!");
//         }
//         else {
//             res.send(err);
//         }
//     });
//     // Article.deleteOne({_id: req.params.id}, function(err) {
//     //     if(!err) {
//     //         res.send("Successfully deleted an article!");
//     //     }
//     //     else {
//     //         res.send(err);
//     //     }
//     // });
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});