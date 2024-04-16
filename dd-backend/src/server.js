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
const Favorite = db.favorites;
const Ingredient = db.ingredients;

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await db.sequelize
    .sync({ force: true })
    .then((data) => {
      const ingredients = Ingredient.bulkCreate([
        {
          ingredientId: "1",
          ingredientName: "วิปครีม",
          ingredientImage:
            "https://st.bigc-cs.com/cdn-cgi/image/format=webp,quality=90/public/media/catalog/product/16/94/9414977000016/9414977000016_1_1.jpg",
          ingredientPricePerUnit: "199",
          ingredientQuantity: "4",
        },
      ]);
      const favorites = Favorite.bulkCreate([
        { userId: "1", recipeId: "1" },
        { userId: "1", recipeId: "2" },
        { userId: "1", recipeId: "4" },
      ]);
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
        userImage: "dist\\images\\avatar_1.png",
      });
      const recipe = Recipe.bulkCreate([
        {
          recipeName: "Spaghetti Carbonara",
          cookingSteps:
            "1. ต้มน้ำให้เดือด แล้วใส่เกลือลงไป จากนั้นใส่เส้นสปาเก็ตตี้ ลงไปต้ม ใช้เวลาต้มประมาณ 4-6 นาที จะได้เส้นที่สุกกำลังดี\n 2. นำไข่ไก่มาแยกไข่แดงออกจากไข่ขาว\n 3.นำเบคอนมาผัดในกระทะจนเหลืองหอม จากนั้นผัดหอมใหญ่จนเริ่มสุก\n 4. ใส่วิปครีมลงไป คนจนวิปครีมเดือด ให้ใส่พาเมซานชีส คนจนชีสละลายดี จากนั้นปรุงด้วยเกลือและพริกไทย\n 5. จัดใส่จานพร้อมเสิร์ฟ",
          ingredients1: "เส้นสปาเก็ตตี้",
          ingredients2: "เบคอน",
          ingredients3: "หอมใหญ่",
          ingredients4: "พาร์สลีย์",
          ingredients5: "วิปครีม",
          ingredients6: "พาเมซานชีส",
          ingredients7: "เกลือ",
          ingredients8: "ไข่แดง",
          measure1: "50 กรัม",
          measure2: "50 กรัม",
          measure3: "30 กรัม",
          measure4: "50 กรัม",
          measure5: "500 มิลลิลิตร",
          measure6: "1/2 ช้อนโต๊ะ",
          measure7: "1/8 ช้อนชา",
          measure8: "1 ฟอง",
          introduce:
            "สปาเก็ตตี้คาโบนาร่าเป็นอาหารพื้นเมืองของอิตาลีที่มีเส้นสปาเก็ตตี้นุ่มๆ รับรสหวานจากไข่และเกลือ และมีรสชาติเข้มข้นจากพาเมซานชีสและเบคอนที่อบกรอบ อาหารชนิดนี้มีชื่อเสียงทั่วโลกและเป็นที่นิยมอย่างมาก โดยมักจะเสริฟพร้อมกับขนมปังหรือขนมปังกรอบ เป็นเมนูที่เหมาะสำหรับคนที่ชื่นชอบอาหารอิตาเลียนและความหรูหราของรสชาติที่เข้มข้น",
          categoryId: [4],
          recipeImage: "dist\\images\\Spagetti_Carbonara.jpg",
          video: "https://www.youtube.com/embed/mRoaxyGLHgw",
          nutAllergy: "0",
          rating: "10.0",
        },
        {
          recipeName: "Pan-fried eggs",
          cookingSteps:
            "1.หั่นครึ่ง ไส้กรอก แฮม เบคอน และ โบโลน่า เตรียมไว้\n 2.ตั้งกระทะใช้ไฟกลางค่อนอ่อน ใส่เนยลงไปรอจนละลาย แล้วใส่เบคอนลงทอดให้พอกรอบ ตามด้วยไส้กรอก แฮม และโบโลน่า เมื่อทุกอย่างพอเปลี่ยนสี จัดให้ไปอยู่ข้างใดข้างหนึ่งให้สวยงาม นำโบโลน่าออกก่อน แล้วตอกไข่ใส่ลงไป ม้วนโบโลน่าให้เป็นรูปดอกไม้ แล้วนำมาวางตรงไข่ขาวที่ยังไม่สุกดี เพื่อให้ไข่ขาวช่วยพยุงโบโลน่าให้อยู่ตัว\n 3.เมื่อไข่เริ่มสุก โรยด้วยมะเขือเทศหั่นเต๋า แล้วปิดไฟ โรยด้วยต้นหอมซอย ปรุงรสด้วยซีอิ๊วขาว และพริกไทย เพียงแต่นี้ “ไข่กระทะ” สไตล์อเมริกันก็พร้อมจัดเสิร์ฟให้เรารับประทาน ",
          ingredients1: "ไข่ไก่",
          ingredients2: "แฮม",
          ingredients3: "ไส้กรอก",
          ingredients4: "เบคอน",
          ingredients5: "โบโลน่า",
          ingredients6: "มะเขือเทศหั่นเต๋า",
          ingredients7: "ต้นหอมซอย",
          ingredients8: "เนย",
          ingredients9: "ซีอิ๊ว",
          ingredients10: "พริกไทย",
          measure1: "2 ฟอง",
          measure2: "2 แผ่น",
          measure3: "2 ชิ้น",
          measure4: "2 ชิ้น",
          measure5: "2 แผ่น",
          measure6: "1/2 ถ้วย",
          measure7: "1 ต้น",
          measure8: "2 ช้อนโต๊ะ",
          measure9: "1 ช้อนชา",
          measure10: "1 ช้อนชา",
          introduce:
            "ไข่กระทะ เมนูอาหารเช้าทำง่าย สามารถหาวัตถุดิบได้จากร้านค้า หรือห้างสรรพสินค้าทั่วไป โดยใช้เวลาเตรียมวัตถุดิบไม่นาน และมีขั้นตอนแน่นอนว่านอกจากความอร่อย ทำง่าย กินง่าย ไข่กระทะยังอุดมไปด้วยสารอาหารครบที่จำเป็นต่อร่างกาย ดีต่อใจและดีต่อสุขภาพ",
          categoryId: [1],
          type: "Soup",
          recipeImage: "dist\\images\\Pan_Fried_Egg.jpg",
          nutAllergy: "0",
          rating: "8.0",
        },
        {
          recipeName: "Beaf Steak",
          cookingSteps:
            "1. ปรุงเนื้อสเต็กด้วยเกลือและพริกไทย\n2. เปิดไฟกระทะหรือเตาแล้วนำเนื้อสเต็กไปย่างจนสุกตามระดับความพอดี ประมาณ 4-5 นาทีต่อด้านสำหรับเนื้อสเต็กปริมาณ 1 นิ้ว\n3. นำเนื้อสเต็กออกจากไฟแล้วปล่อยให้พักสักครู่ก่อนหั่น\n4. เสริฟเนื้อสเต็กพร้อมกับอาหารที่ชอบ",
          ingredients1: " เนื้อสเต็กหนา 1 นิ้ว",
          ingredients2: "เกลือ ตามรสชาติ",
          ingredients3: "พริกไทย ตามรสชาติ",
          ingredients4: "น้ำมันมะกอก สำหรับย่าง",
          ingredients5: "กระเทียม",
          ingredients6: "โรสแมรี่",
          ingredients7: "สมุนไพรต่างๆ สำหรับปรุงรส",
          ingredients8: "เนย",
          ingredients9: "ซีอิ๊ว",
          ingredients10: "พริกไทย",
          measure1: "1 ชิ้น",
          measure2: "10 กรัม",
          measure3: "10 กรัม",
          measure4: "1 ช้อนโต๊ะ",
          measure5: "1/2 ถ้วย",
          measure6: "1/2 ถ้วย",
          measure7: "1/2 ถ้วย",
          measure8: "10 กรัม",
          measure9: "1 ช้อนชา",
          measure10: "1 ช้อนชา",
          introduce:
            "สเต็กเนื้อเป็นเมนูอาหารที่เป็นที่นิยมและเหมาะสำหรับทุกโอกาส ไม่ว่าจะเป็นการย่างนอกบ้านหรือใช้กระทะบนเตา สำคัญคือการปรุงรสด้วยเกลือและพริกไทยอย่างเหมาะสม และนำไปย่างให้สุกตามรสชาติที่ต้องการ ให้เสิร์ฟพร้อมกับมันสำปะหลังสับ, ผักย่าง หรือสลัดสดเพื่อได้เมนูครบถ้วน",
          categoryId: [2],
          recipeImage: "dist\\images\\steak.jpg",
          nutAllergy: "0",
        },
        {
          recipeName: "Beef Rice Bowl",
          cookingSteps:
            "1.นำซีอิ๊วญี่ปุ่น สาเก มิริน และดาชิ มาผสมกันในชามผสม แล้วพักไว้\n 2.ตั้งกระทะใช้ไฟกลาง ใส่น้ำมันงาลงไป เมื่อน้ำมันร้อน ใส่เนื้อวัว และน้ำตาลลงไป ผัดจนเนื้อเกือบสุก แล้วตักขึ้นพักไว้เปลี่ยนกระทะใหม่ ใส่หอมใหญ่ ขิงขูด และส่วนผสมน้ำซอสที่เตรียมไว้ลงในกระทะ ก่อนผัดให้หอมใหญ่เริ่มนิ่ม จากนั้นต้มต่อให้พอเดือด ใส่เนื้อที่ผัดเตรียมไว้ลงไป ผัดด้วยความเร็วให้พอเข้ากัน ก่อนปิดไฟยกลง \n 3.นำเนื้อที่ผัดตักราดบนข้าวญี่ปุ่น ตอกไข่ลงไป และตกแต่งด้วยต้นหอมญี่ปุ่น ขิงดองสีแดง และสาหร่าย ก่อนโรยด้วยพริกญี่ปุ่นพร้อมจัดเสิร์ฟให้เรารับประทาน ",
          ingredients1: "ไข่ไก่",
          ingredients2: "เนื้อวัวแล่บาง",
          ingredients3: "หอมใหญ่หั่นเสี้ยว",
          ingredients4: "ขิงขูด",
          ingredients5: "ซีอิ๊วญี่ปุ่น",
          ingredients6: "สาเก",
          ingredients7: "มิริน",
          ingredients8: "ดาชิ",
          ingredients9: "น้ำมันงา",
          ingredients10: "ไข่ไก่",
          ingredients11: "ขิงดองสีแดง สำหรับกินคู่",
          ingredients12: "สาหร่าย สำหรับโรยหน้า",
          ingredients13: "ต้นหอมญี่ปุ่นซอย สำหรับโรยหน้า",
          ingredients14: "พริกป่นญี่ปุ่น สำหรับโรยหน้า",
          ingredients15: "ข้าวสวยญี่ปุ่น",
          measure1: "150 กรัม",
          measure2: "3/4 ถ้วยตวง",
          measure3: "1 ช้อนโต๊ะ",
          measure4: "3 ช้อนโต๊ะ",
          measure5: "2 ช้อนโต๊ะ",
          measure6: "2 ช้อนโต๊ะ",
          measure7: "1/4 ถ้วยตวง",
          measure8: "2 ช้อนชา",
          measure9: "1 ช้อนชา",
          measure10: "10 กรัม",
          measure11: "10 กรัม",
          measure12: "10 กรัม",
          measure13: "10 กรัม",
          measure14: "10 กรัม",
          measure15: "1 ถ้วย",
          introduce:
            "ข้าวหน้าเนื้อ ถือว่าเป็นอาหารฟาสต์ฟู้ดของชาวญี่ปุ่น เป็นเมนูง่ายๆ และรวดเร็ว แถมยังอิ่มนาน สารอาหารครบถ้วนอีกด้วย",
          categoryId: [2],
          recipeImage: "dist\\images\\beef_rice.jpg",
          nutAllergy: "0",
          rating: "5.4",
        },
        {
          recipeName: "Crispy Chick Fried",
          cookingSteps:
            "1. นำไก่ที่ผ่าดอกออกมาทำความสะอาดและเช็ดแห้ง\n2. ผสมแป้งทอดกรอบกับเกลือ พริกไทย และเครื่องปรุงรสตามชอบ\n3. จากนั้นนำไก่มาหล่อนแป้งทอดกรอบให้ทั่ว\n4. ทอดในน้ำมันร้อนจนเหลืองกรอบและสุกทั้งสองด้าน\n5. ตักใส่จานพร้อมเสิร์ฟ",
          ingredients1: "เนื้อวัวแล่บาง",
          ingredients2: "ไก่บด",
          ingredients3: "แป้งทอดกรอบ",
          ingredients4: "เกลือ",
          ingredients5: "พริกไทย",
          ingredients6: "น้ำมัน",
          measure1: "500 กรัม",
          measure2: "1 ถ้วย",
          measure3: "1 ช้อนชา",
          measure4: "1/2 ช้อนชา",
          measure5: "10 กรัม",
          measure6: "1 ช้อนโต๊ะ",
          introduce:
            "เมนูอาหารทอดกรอบที่มีรสชาติเครื่องเทศกลมกล่อมและกรอบนุ่มที่ยากจะหาที่ไหนได้ใกล้เคียง เป็นเมนูที่เหมาะสำหรับทุกเพศทุกวัย ทานได้ทั้งเป็นอาหารหลักหรือเป็นอาหารว่าง",
          categoryId: [3],
          recipeImage: "dist\\images\\chicken_fried.jpg",
          nutAllergy: "0",
          rating: "7.8",
          timeBased: "120m",
        },
        {
          recipeName: "Stir-fried vegetarian",
          cookingSteps:
            "1. หมักเนื้อให้สุกในน้ำปลา ซีอิ๊ว น้ำตาล และพริกไทย\n2. ตั้งกระทะใส่น้ำมันลงไป พอน้ำมันร้อนใส่กระเทียมและพริกไทยสดลงไปผัดจนหอม\n3. ใส่เนื้อหมักที่หมักไว้ลงไปผัดจนสุก\n4. ใส่ผักต่างๆ เช่น คะน้า กะหล่ำปลี ผักชี และพริกลงไปผัด\n5. ปรุงรสตามชอบ จัดเสิร์ฟพร้อมข้าวสวย",
          ingredients1: "เนื้อวัวแล่บาง",
          ingredients2: "คะน้า",
          ingredients3: "กะหล่ำปลี",
          ingredients4: "ผักชี",
          ingredients5: "พริกแห้ง",
          ingredients6: "กระเทียมสับ",
          ingredients7: "ซอสหอยนางรม",
          ingredients8: "ซอสปรุงรส",
          ingredients9: "น้ำตาลทราย",
          ingredients10: "น้ำปลา",
          ingredients11: "พริกไทยป่น",
          ingredients12: "น้ำมันพืช",
          measure1: "200 กรัม",
          measure2: "100 กรัม",
          measure3: "100 กรัม",
          measure4: "50 กรัม",
          measure5: "ตามชอบ",
          measure6: "2 ช้อนโต๊ะ",
          measure7: "2 ช้อนโต๊ะ",
          measure8: "1 ช้อนโต๊ะ",
          measure9: "1 ช้อนชา",
          measure10: "1 ช้อนโต๊ะ",
          measure11: "1 ช้อนชา",
          measure12: "2 ช้อนโต๊ะ",
          introduce:
            "เมนูผัดผักเป็นอาหารที่มีรสชาติหอม อร่อย และสีสันสดใส มีความเผ็ดน้อยพอดีกับคนไทย สามารถเพิ่มหรือลดระดับความเผ็ดได้ตามชอบ",
          categoryId: [5],
          recipeImage: "dist\\images\\stir_fried_vegetables.jpg",
          nutAllergy: "0",
          vegetarian: "0",
          rating: "10.0",
          timeBased: "120m",
        },
        {
          recipeName: "Vegetarian Salad",
          cookingSteps:
            "1. ล้างผักทุกชนิดให้สะอาด\n2. หั่นผักเป็นชิ้นเล็กๆ\n3. ผสมผักทุกชนิดในชามใหญ่\n4. ปรุงน้ำสลัด: ผสมน้ำมันมะพร้าว, มะนาว, น้ำตาล, ซอสซอย, และเกลือให้เข้ากัน\n5. รวมน้ำสลัดกับผักและคนให้เข้ากัน\n6. ตักสลัดใส่จานเสิร์ฟพร้อมกับเมล็ดที่แต่งด้วย",
          ingredients1: "ผักสดต่างๆ",
          ingredients2: "เมล็ดแต่งสลัด",
          ingredients3: "น้ำมันมะพร้าว",
          ingredients4: "มะนาว",
          ingredients5: "น้ำตาลทราย",
          ingredients6: "ซอสซอย",
          ingredients7: "เกลือ",
          measure3: "2 ช้อนโต๊ะ",
          measure4: "2 ลูก",
          measure5: "1 ช้อนชา",
          measure6: "1 ช้อนโต๊ะ",
          measure7: "10 กรัม",
          introduce:
            "สลัดผักมังสวิรัติเป็นอาหารที่เสริมสร้างสุขภาพด้วยผักสดและเมล็ดที่อุดมไปด้วยโภชนาการ มีรสชาติหวานเปรี้ยวจากมะนาวและน้ำตาล และมีความเค็มน้อยจากเกลือ",
          categoryId: [5],
          recipeImage: "dist\\images\\salad_nut.jpg",
          nutAllergy: "1",
          vegetarian: "1",
        },
        {
          recipeName: "Vegetarian fried rice",
          cookingSteps:
            "1. หั่นมังสวิรัติเป็นชิ้นเล็กๆ\n2. ตั้งกระทะให้ร้อน และใส่น้ำมันพืช\n3. ใส่มังสวิรัติลงไปผัดจนเริ่มนิ่ม\n4. ใส่ข้าวสวยลงไปผัดให้เข้ากัน\n5. ปรุงรสตามชอบ เช่น ซอสซอย, น้ำปลา, น้ำมันหอย\n6. ตักข้าวผัดมังสวิรัติใส่จานเสิร์ฟพร้อมผักสด",
          ingredients1: "มังสวิรัติสด",
          ingredients2: "ข้าวสวย",
          ingredients3: "น้ำมันพืช",
          ingredients4: "ซอสซอย",
          ingredients5: "น้ำปลา",
          ingredients6: "น้ำมันหอย",
          ingredients7: "ผักสดต่างๆ",
          measure1: "1/2 ถ้วย",
          measure2: "1 ถ้วย",
          measure3: "1 ช้อนชา",
          measure4: "1 ช้อนโต๊ะ",
          measure5: "1 ช้อนโต๊ะ",
          measure6: "1 ช้อนโต๊ะ",
          measure7: "1/2 ถ้วย",
          introduce:
            "ข้าวผัดมังสวิรัติเป็นอาหารสำหรับคนที่รักในรสชาติของมังสวิรัติ มีกลิ่นหอมจากการผัดอย่างสุดคลายใจ สามารถเพิ่มผักสดเพื่อความเป็นสุขภาพมากขึ้นได้",
          categoryId: [5],
          recipeImage: "dist\\images\\vegan_fried_rice.jpg",
          nutAllergy: "0",
          vegetarian: "1",
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
