const express = require("express");
const cors = require("cors");
const ip = require("ip");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const swaggerUi = require("swagger-ui-express");

const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("src/swagger.yaml", "utf8");
const swaggerDoc = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const corsOptions = {
  origin: "http://localhost",
};

//port
const port = process.env.PORT || 8080;
const db = require(".");

const Recipe = db.recipes;
const Category = db.categories;

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await db.sequelize
    .sync({ force: true })
    .then((data) => {
      const categories = Category.bulkCreate([
        { categoryName: "Egg" },
        { categoryName: "Beef" },
        { categoryName: "Chicken" },
        { categoryName: "Pork" },
        { categoryName: "Vegetarian" },
      ]);
      console.log("Table and model has been synced");
      const recipe = Recipe.bulkCreate([
        {
          recipeName: "Spaghetti Carbonara",
          cookingSteps:
            "1. ต้มน้ำให้เดือด แล้วใส่เกลือลงไป จากนั้นใส่เส้นสปาเก็ตตี้ ลงไปต้ม ใช้เวลาต้มประมาณ 4-6 นาที จะได้เส้นที่สุกกำลังดี\n 2. นำไข่ไก่มาแยกไข่แดงออกจากไข่ขาว\n 3.นำเบคอนมาผัดในกระทะจนเหลืองหอม จากนั้นผัดหอมใหญ่จนเริ่มสุก\n 4. ใส่วิปครีมลงไป คนจนวิปครีมเดือด ให้ใส่พาเมซานชีส คนจนชีสละลายดี จากนั้นปรุงด้วยเกลือและพริกไทย\n 5. จัดใส่จานพร้อมเสิร์ฟ",
          cookingIngredients:
            "1. เส้นสปาเก็ตตี้ 50 กรัม\n 2.เบคอน 50 กรัม\n 3.หอมใหญ่ 30 กรัม\n 4.พาร์สลีย์\n 5.วิปครีม 500 มิลลิลิตร\n 6.พาเมซานชีส 1/2 ช้อนโต๊ะ\n 7.เกลือ 1/8 ช้อนชา\n 8.ไข่แดง 1 ฟอง",
          introduce:
            "สปาเก็ตตี้คาโบนาร่าเป็นอาหารพื้นเมืองของอิตาลีที่มีเส้นสปาเก็ตตี้นุ่มๆ รับรสหวานจากไข่และเกลือ และมีรสชาติเข้มข้นจากพาเมซานชีสและเบคอนที่อบกรอบ อาหารชนิดนี้มีชื่อเสียงทั่วโลกและเป็นที่นิยมอย่างมาก โดยมักจะเสริฟพร้อมกับขนมปังหรือขนมปังกรอบ เป็นเมนูที่เหมาะสำหรับคนที่ชื่นชอบอาหารอิตาเลียนและความหรูหราของรสชาติที่เข้มข้น",
          categoryId: [1],
          recipeImage: "dist\\images\\Spagetti_Carbonara.jpg",
        },
        {
          recipeName: "Pad Thai",
          cookingSteps: "Soak rice noodles...",
          cookingIngredients: "Cook shrimp and tofu...",
          introduce: "A popular Thai stir-fried noodle dish...",
          categoryId: [2],
          recipeImage: "dist\\images\\Spagetti_Carbonara.jpg",
        },
        {
          recipeName: "Margherita Pizza",
          cookingSteps: "Preheat oven...",
          cookingIngredients: "Stretch pizza dough...",
          introduce:
            "An Italian pizza topped with tomatoes, mozzarella, and basil...",
          categoryId: [3],
          recipeImage: "dist\\images\\Spagetti_Carbonara.jpg",
        },
        {
          recipeName: "Caesar Salad",
          cookingSteps: "Prepare lettuce and croutons...",
          cookingIngredients: "Make Caesar dressing...",
          introduce:
            "A classic salad with romaine lettuce, croutons, and Caesar dressing...",
          categoryId: [4],
          recipeImage: "dist\\images\\Spagetti_Carbonara.jpg",
        },
        {
          recipeName: "Tiramisu",
          cookingSteps: "Make espresso and soak ladyfingers...",
          cookingIngredients: "Prepare mascarpone mixture...",
          introduce:
            "An Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream...",
          categoryId: [4],
          recipeImage: "dist\\images\\Spagetti_Carbonara.jpg",
        },
      ]);
    })
    .catch((err) => {
      console.log(err, "Error syncing the table and model");
    });
})();

// (async () => {
//   await db.sequelize
//     .sync()
//     .then((data) => {
//       console.log("Table and model created");
//     })
//     .catch((err) => {
//       console.log("Error created");
//     });
// })();

//routes
const router = require("./routes");
const multer = require("multer");
const { recipesData } = require("./app/recipe/mockup");
app.use("/api", router);

//static img folder
app.use("/dist/images", express.static("dist/images"));

//server
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from api!" });
});

app.listen(port, () =>
  console.log(`[server] listening on: ${ip.address()}:${port}`)
);
