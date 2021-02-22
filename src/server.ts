import express from 'express';

const app = express();

app.use(express.json())


app.get("/", (req, res) => {
    return res.json({ message: "Hello GET data Node_NLW#4" });
});

app.post("/", (req, res) => {
    return res.json({ message: "Hello POST data in Node_NLW#4", data: req.body });
});


app.listen(3333, () => console.log('Server is running...'));
