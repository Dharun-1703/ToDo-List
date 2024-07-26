import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user:'postgres',
  host:'localhost',
  database:'permalist',
  password:"0511",
  port:5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const result = await db.query("SELECT * FROM items");
const items=result.rows;

async function currentvalues(){
  const res=await db.query("SELECT * FROM items");
  const items=res.rows;
  return items;
}

app.get("/", async(req, res) => {
  try {
    const currentvalue=await currentvalues();
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: currentvalue,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async(req, res) => {
  try {
    const item = req.body.newItem;
    await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async(req, res) => {
  try {
    const value=req.body.updatedItemTitle;
    const id=req.body.updatedItemId;
    await db.query("UPDATE items SET title=$1 WHERE id =$2",[value,id]);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async(req, res) => {
  try {
    const value=req.body.deleteItemId;
    await db.query("DELETE FROM items WHERE id = $1",[value]);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

app.listen(port);
