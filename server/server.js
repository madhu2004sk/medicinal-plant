const express = require("express");
const cors = require('cors');
const pool = require("./db");
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error } = require('console');
const { platform } = require('os');
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");

const SELECT_KEY = "medicinal_plant_secret";

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("scanner"));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..')));

app.get('/plants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM plants ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post("/signup", async (req, res) => {
    try{
        const { name, email, password} = req.body;

        //Check user exists
        const userExists = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (userExists.rows.length >0) { 
            return res.status(400).json({ message: "User already exists"});
        }

        //Hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1,$2,$3)",
        [name, email, hashedPassword]
        );

        res.json({ message: "Signup successful" });
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup failed" });
    }
});

app.post("/signin", async (req, res) => {
    try{
        const { email, password} = req.body;

        //Check if user exists
        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );
        
        if (result.rows.length == 0) {
            return res.status(401).json({ message: " Invalid email or passwoed"});
        }

        const user = result.rows[0];

        //compare password
        const isMstch = await bcrypt.compare(password, user.password);
        if(!isMstch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //Genrate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            SELECT_KEY,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            name: user.name
        });
    } catch(err){
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

app.use("/scanner", express.static(path.join(__dirname, "../scanner")));

app.get("/", (req,res) => {
    res.send("Node Server Running")
});

app.post("/scan", async (req, res) => {
    try {
        const image = req.body.image;

        const aiResponse = await axios.post(
            "http://127.0.0.1:5000/predict",
            { image }
        );

        const { plant, confidence } = aiResponse.data;

        // 1️⃣ Reject unknown from AI
        if (plant === "Unknown") {
            return res.json({
                success: false,
                message: "Object is not a supported medicinal plant",
                confidence
            });
        }

        // 2️⃣ Confidence check
        if (confidence < 70) {
            return res.json({
                success: false,
                message: "Plant not confidently recognized",
                confidence
            });
        }

        // 3️⃣ Allowed plants check (safety)
        const allowedPlants = [
            "Aloe Vera",
            "Hibiscus",
            "Neem"
        ];

        if (!allowedPlants.includes(plant)) {
            return res.json({
                success: false,
                message: "Unknown plant"
            });
        }

        // 4️⃣ Save scan history
        await pool.query(
            "INSERT INTO scan_history (plant_name, confidence) VALUES ($1, $2)",
            [plant, confidence]
        );

        // 5️⃣ Success
        res.json({
            success: true,
            plant,
            confidence
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Scan failed"
        });
    }
});

        
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 
