import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import path from 'path';

const port = 5000;
const app = express();


app.use(cors());
app.use(express.json());


app.get('/students', async (req, res) => {
    try {

        const allStudents = await db.query('SELECT * FROM students');
        console.log(allStudents)
        res.status(200).send(allStudents.rows)

    } catch (err) {
        console.log("err", err);
        res.status(500).send({ status: "Error", message: "Something went wrong" });
    }

});

app.post('/students', async (req, res) => {
    const reqbody = req.body;

    if (!reqbody.full_name || !reqbody.course || !reqbody.roll_number || !reqbody.age) {
        return res.status(400).send({ status: "Error", message: "Required parameter missing" });
    }

    try {
        const dbResponse = await db.query(
            'INSERT INTO students (full_name, course, roll_number, age) VALUES ($1,$2,$3,$4)',
            [reqbody.full_name, reqbody.course, reqbody.roll_number, reqbody.age]
        );
        res.status(201).send({ status: "success", message: "Student added successfully" });

    } catch (err) {
        console.log("err", err);

        if (err.code === '23505') {
            return res.status(409).send({ status: "Error", message: "This roll number already exists" });
        }

        res.status(500).send({ status: "Error", message: "Something went wrong" });
    }
});


app.put('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    const reqbody = req.body;

    if (!reqbody.full_name || !reqbody.course || !reqbody.roll_number || !reqbody.age) {
        return res.status(400).send({ status: "Error", message: "Required parameter missing" });
    }

    try {
        const dbResponse = await db.query(
            `UPDATE students SET 
            full_name = $1, 
            course = $2,
            roll_number = $3,
            age = $4
            WHERE id = $5;`,
            [reqbody.full_name, reqbody.course, reqbody.roll_number, reqbody.age, studentId]
        );

        if (dbResponse.rowCount === 0) {
            return res.status(404).send({ status: "Error", message: "Student not found" });
        };
        res.status(200).send({ status: "success", message: "Student Updated Successfully" });

    } catch (err) {
        console.log(err);

        if (err.code === '23505') {
            return res.status(409).send({ status: "Error", message: "This roll number already exists" });
        }

        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
});

app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const dbResponse = await db.query(
            `DELETE FROM students WHERE id = $1;`, [studentId]
        );

        if (dbResponse.rowCount === 0) {
            return res.status(404).send({ status: "Error", message: "Student not found" });
        };

        res.status(200).send({ status: "success", message: "Student delete successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "error", message: "Internal Server Error" })
    }

});




const __dirname = path.resolve();
const __frontend = path.join(__dirname, './student-crud/build');
app.use('/', express.static(__frontend));
app.use("/*splat", express.static(__frontend));


app.listen(port, () => {
    console.log(`app is running on port ${port}`)
});