// express is a CommonJS module, so we use require to import it
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
    // place the URL of the frontend here, dont include anything to allow all
}

app.use(cors(corsOptions));
app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
    }
);

app.listen(42069, () => {
    console.log("Server is running on port 42069.");
});





