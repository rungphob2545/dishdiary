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
const User = db.users;

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
      const superUser = User.create({
        userName: "superuser",
        userEmail: "superuser01@mail.com",
        password:
          "$2b$10$dRcsEB1USbHe6gAhnHFEXOxUAMytTCjGnzkfzfeeHLPjye853YxEe",
        role: "Admin",
      });
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
          video: "https://www.youtube.com/embed/mRoaxyGLHgw",
          nutAllergy: "1",
        },
        {
          recipeName: "Pan-fried eggs",
          cookingSteps:
            "1.หั่นครึ่ง ไส้กรอก แฮม เบคอน และ โบโลน่า เตรียมไว้\n 2.ตั้งกระทะใช้ไฟกลางค่อนอ่อน ใส่เนยลงไปรอจนละลาย แล้วใส่เบคอนลงทอดให้พอกรอบ ตามด้วยไส้กรอก แฮม และโบโลน่า เมื่อทุกอย่างพอเปลี่ยนสี จัดให้ไปอยู่ข้างใดข้างหนึ่งให้สวยงาม นำโบโลน่าออกก่อน แล้วตอกไข่ใส่ลงไป ม้วนโบโลน่าให้เป็นรูปดอกไม้ แล้วนำมาวางตรงไข่ขาวที่ยังไม่สุกดี เพื่อให้ไข่ขาวช่วยพยุงโบโลน่าให้อยู่ตัว\n 3.เมื่อไข่เริ่มสุก โรยด้วยมะเขือเทศหั่นเต๋า แล้วปิดไฟ โรยด้วยต้นหอมซอย ปรุงรสด้วยซีอิ๊วขาว และพริกไทย เพียงแต่นี้ “ไข่กระทะ” สไตล์อเมริกันก็พร้อมจัดเสิร์ฟให้เรารับประทาน ",
          cookingIngredients:
            "1.ไข่ไก่ 2 ฟอง\n 2.แฮม 2 แผ่น\n 3.ไส้กรอก 2 ชิ้น\n 4.sเบคอน 2 ชิ้น\n 5.โบโลน่า 2 แผ่น\n 6.มะเขือเทศหั่นเต๋า ½ ถ้วย\n 7.ต้นหอมซอย 1 ต้น\n 8.เนย 2 ช้อนโต๊ะ\n 9.ซีอิ๊ว และพริกไทย",
          introduce:
            "ไข่กระทะ เมนูอาหารเช้าทำง่าย สามารถหาวัตถุดิบได้จากร้านค้า หรือห้างสรรพสินค้าทั่วไป โดยใช้เวลาเตรียมวัตถุดิบไม่นาน และมีขั้นตอนแน่นอนว่านอกจากความอร่อย ทำง่าย กินง่าย ไข่กระทะยังอุดมไปด้วยสารอาหารครบที่จำเป็นต่อร่างกาย ดีต่อใจและดีต่อสุขภาพ",
          categoryId: [1],
          recipeImage: "dist\\images\\Pan_Fried_Egg.jpg",
          nutAllergy: "1",
        },
        {
          recipeName: "Beaf Steak",
          cookingSteps:
            "1. ปรุงเนื้อสเต็กด้วยเกลือและพริกไทย\n2. เปิดไฟกระทะหรือเตาแล้วนำเนื้อสเต็กไปย่างจนสุกตามระดับความพอดี ประมาณ 4-5 นาทีต่อด้านสำหรับเนื้อสเต็กปริมาณ 1 นิ้ว\n3. นำเนื้อสเต็กออกจากไฟแล้วปล่อยให้พักสักครู่ก่อนหั่น\n4. เสริฟเนื้อสเต็กพร้อมกับอาหารที่ชอบ",
          cookingIngredients:
            "1. เนื้อสเต็ก หนา 1 นิ้ว\n2. เกลือ ตามรสชาติ\n3. พริกไทย ตามรสชาติ\n4. น้ำมันมะกอก สำหรับย่าง\n5. อื่นๆ: กระเทียม, โรสแมรี่ หรือสมุนไพรต่างๆ สำหรับปรุงรส",
          introduce:
            "สเต็กเนื้อเป็นเมนูอาหารที่เป็นที่นิยมและเหมาะสำหรับทุกโอกาส ไม่ว่าจะเป็นการย่างนอกบ้านหรือใช้กระทะบนเตา สำคัญคือการปรุงรสด้วยเกลือและพริกไทยอย่างเหมาะสม และนำไปย่างให้สุกตามรสชาติที่ต้องการ ให้เสิร์ฟพร้อมกับมันสำปะหลังสับ, ผักย่าง หรือสลัดสดเพื่อได้เมนูครบถ้วน",
          categoryId: [2],
          recipeImage: "dist\\images\\steak.jpg",
          nutAllergy: "0",
        },
        {
          recipeName: "Caesar Salad",
          cookingSteps: "Prepare lettuce and croutons...",
          cookingIngredients: "Make Caesar dressing...",
          introduce:
            "A classic salad with romaine lettuce, croutons, and Caesar dressing...",
          categoryId: 4,
          recipeImage: "dist\\images\\Spagetti_Carbonara.jpg",
          vegetarian: "1",
        },
        {
          recipeName: "Tiramisu",
          cookingSteps: "Make espresso and soak ladyfingers...",
          cookingIngredients: "Prepare mascarpone mixture...",
          introduce:
            "An Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream...",
          categoryId: 4,
          recipeImage: "dist\\images\\Spagetti_Carbonara.jpg",
        },
      ]);
      console.log("Table and model has been synced");
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
