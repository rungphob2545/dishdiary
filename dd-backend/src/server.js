const express = require("express");
const cors = require("cors");
const ip = require("ip");
const app = express();
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
          ingredientName: "มะเขือเทศ",
          ingredientImage:
            "https://cdn.pixabay.com/photo/2018/06/17/14/44/tomatoes-3480643_1280.jpg",
          ingredientPricePerUnit: "29",
          ingredientQuantity: "1",
        },
        {
          ingredientId: "2",
          ingredientName: "เนื้อไก่",
          ingredientImage:
            "https://www.shutterstock.com/image-photo/fresh-raw-chicken-isolated-on-600nw-583587001.jpg",
          ingredientPricePerUnit: "150",
          ingredientQuantity: "1",
        },
        {
          ingredientId: "3",
          ingredientName: "เนื้อสเต็กวัว",
          ingredientImage:
            "https://png.pngtree.com/thumb_back/fh260/background/20220523/pngtree-steaks-meal-tasty-cow-photo-image_79812.jpg",
          ingredientPricePerUnit: "300",
          ingredientQuantity: "1",
        },
        {
          ingredientId: "4",
          ingredientName: "หอมแดง",
          ingredientImage:
            "https://cdn.pixabay.com/photo/2023/01/13/15/41/onions-7716342_1280.jpg",
          ingredientPricePerUnit: "20",
          ingredientQuantity: "1",
        },
        {
          ingredientId: "5",
          ingredientName: "เส้นสปาเก็ตตี้",
          ingredientImage:
            "https://png.pngtree.com/thumb_back/fh260/background/20220112/pngtree-bundles-of-spaghetti-pasta-white-background-noodles-spaghetti-photo-image_28841002.jpg",
          ingredientPricePerUnit: "159",
          ingredientQuantity: "1",
        },
        {
          ingredientId: "6",
          ingredientName: "ช็อกโกแลต",
          ingredientImage:
            "https://png.pngtree.com/png-vector/20240129/ourmid/pngtree-chocolate-bar-tablets-png-image_11564535.png",
          ingredientPricePerUnit: "59",
          ingredientQuantity: "1",
        },
        {
          ingredientId: "7",
          ingredientName: "กะหล่ำปี",
          ingredientImage:
            "https://png.pngtree.com/thumb_back/fw800/background/20230905/pngtree-cabbage-on-white-background-premium-royalty-free-code-6706768943-image_13236609.jpg",
          ingredientPricePerUnit: "39",
          ingredientQuantity: "1",
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
        id: 1,
        userName: "superuser",
        userEmail: "superuser01@mail.com",
        password:
          "$2b$10$dRcsEB1USbHe6gAhnHFEXOxUAMytTCjGnzkfzfeeHLPjye853YxEe",
        role: "Admin",
        userNumber: "0809885665",
        userImage: "dist\\images\\avatar_1.png",
      });
      const normalUser = User.create({
        userName: "nabin",
        userEmail: "nabin.ameen@gmail.com",
        password:
          "$2a$12$SuV./nFfPvED9LKgvs/9yexwaZF5lYkHrL5BA3wobXA7ULimFQjCO",
        role: "User",
        userNumber: "0981725583",
        userImage: "dist\\images\\avatar_1.png",
      });

      const normalUser1 = User.create({
        userName: "test",
        userEmail: "test01@gmail.com",
        password:
          "$2a$12$SuV./nFfPvED9LKgvs/9yexwaZF5lYkHrL5BA3wobXA7ULimFQjCO",
        role: "User",
        userNumber: "0807432012",
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
          categoryTh: "เนื้อวัว",
          categoryEn: "Beef",
          typeTh: "เส้น",
          typeEn: "Noodle",
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
          categoryTh: "ไข่",
          categoryEn: "Egg",
          typeTh: "กับข้าว",
          typeEn: "Side dish",
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
          categoryTh: "เนื้อวัว",
          categoryEn: "Beef",
          typeTh: "สเต็ก",
          typeEn: "Steak",
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
          categoryTh: "เนื้อวัว",
          categoryEn: "Beef",
          typeTh: "ข้าว",
          typeEn: "Rice",
          recipeImage: "dist\\images\\beef_rice.jpg",
          nutAllergy: "0",
          rating: "5.4",
        },
        {
          recipeName: "Crispy Chick Fried",
          cookingSteps:
            "1. นำไก่ที่ผ่าดอกออกมาทำความสะอาดและเช็ดแห้ง\n2. ผสมแป้งทอดกรอบกับเกลือ พริกไทย และเครื่องปรุงรสตามชอบ\n3. จากนั้นนำไก่มาหล่อนแป้งทอดกรอบให้ทั่ว\n4. ทอดในน้ำมันร้อนจนเหลืองกรอบและสุกทั้งสองด้าน\n5. ตักใส่จานพร้อมเสิร์ฟ",
          ingredients1: "อกไก่",
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
          categoryTh: "เนื้อไก่",
          categoryEn: "Chicken",
          typeTh: "Fried",
          typeEn: "ของทอด",
          recipeImage: "dist\\images\\chicken_fried.jpg",
          nutAllergy: "0",
          rating: "7.8",
          timeBased: "120m",
        },
        {
          recipeName: "Stir-fried vegetarian",
          cookingSteps:
            "1. ตั้งกระทะใส่น้ำมันพืชลงไป รอจนน้ำมันร้อน\n2. ใส่กระเทียมและขิงสับลงไปผัดจนมีกลิ่นหอม\n3. ใส่หอมใหญ่ลงไปผัดจนเริ่มใส\n4. ใส่พริกหวาน แครอท เห็ดหอม ถั่วลันเตา และบร็อคโคลี่ลงไปผัดต่อประมาณ 3-5 นาที\n5. ปรุงรสด้วยซีอิ๊วขาว ซอสหอยนางรมเจ น้ำตาลทราย และพริกไทยป่น ผัดให้เข้ากัน",
          ingredients1: "แครอทแล่",
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
          categoryTh: "มังสวิรัติ",
          categoryEn: "Vegan",
          typeTh: "กับข้าว",
          typeEn: "Side dish",
          recipeImage: "dist\\images\\stir_fried_vegetables.jpg",
          nutAllergy: "0",
          vegetarian: "1",
          rating: "10.0",
          timeBased: "120m",
        },
        {
          recipeName: "Vegetarian Salad",
          cookingSteps:
            "1. ล้างผักทุกชนิดให้สะอาด\n2. หั่นผักเป็นชิ้นเล็กๆ\n3. ผสมผักทุกชนิดในชามใหญ่\n4. ปรุงน้ำสลัด: ผสมน้ำมันมะพร้าว, มะนาว, น้ำตาล, ซอสซอย, และเกลือให้เข้ากัน\n5. รวมน้ำสลัดกับผักและคนให้เข้ากัน\n6. ตักสลัดใส่จานเสิร์ฟพร้อมกับเมล็ดที่แต่งด้วย",
          ingredients1: "ผักสดต่างๆ",
          ingredients2: "ถั่วแต่งสลัด",
          ingredients3: "น้ำมันมะพร้าว",
          ingredients4: "มะนาว",
          ingredients5: "น้ำตาลทราย",
          ingredients6: "ซอสซอย",
          ingredients7: "เกลือ",
          measure1: "200 กรัม",
          measure2: "100 กรัม",
          measure3: "2 ช้อนโต๊ะ",
          measure4: "1 ช้อนโต๊ะ",
          measure5: "1 ช้อนชา",
          measure6: "1 ช้อนโต๊ะ",
          measure7: "10 กรัม",
          introduce:
            "สลัดผักมังสวิรัติเป็นอาหารที่เสริมสร้างสุขภาพด้วยผักสดและเมล็ดถั่วที่อุดมไปด้วยโภชนาการ มีรสชาติหวานเปรี้ยวจากมะนาวและน้ำตาล และมีความเค็มน้อยจากเกลือ",
          categoryTh: "มังสวิรัติ",
          categoryEn: "Vegan",
          typeTh: "กับข้าว",
          typeEn: "Side dish",
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
          categoryTh: "มังสวิรัติ",
          categoryEn: "Vegan",
          typeTh: "ข้าว",
          typeEn: "Rice",
          recipeImage: "dist\\images\\vegan_fried_rice.jpg",
          nutAllergy: "0",
          vegetarian: "1",
        },
        {
          recipeName: "Stir-fried Chicken with Ginger",
          cookingSteps:
            "1.หมักไก่ กับซอสปรุงรส และซีอิ๊วขาว เป็นเวลา 10 นาที\n 2.ตั้งกระทะ ใส่น้ำมัน ผัดกระเทียม และเต้าเจี้ยวให้หอมดี ใส่ไก่และน้ำหมักลงไป พร้อมด้วยน้ำสะอาด และน้ำตาลทราย ผัดต่อจนไก่สุกดี\n 3.ใส่ขิง เห็ดหูหนู และพริกชี้ฟ้า ผัดต่อจนขิงนุ่ม\n 4.ใส่ต้นหอม เคล้าเล็กน้อย ตักเสิร์ฟ",
          ingredients1: "สะโพกไก่ (หั่นชิ้น)",
          ingredients2: "น้ำมันรำข้าว",
          ingredients3: "กระเทียม (โขลก)",
          ingredients4: "เต้าเจี้ยว",
          ingredients5: "ซอสปรุงรส",
          ingredients6: "ซีอิ๊วขาว",
          ingredients7: "น้ำตาลทราย",
          ingredients8: "น้ำสะอาด",
          ingredients9: "ขิง (ซอย)",
          ingredients10: "พริกชี้ฟ้า (ซอยแฉลบ)",
          ingredients11: "ต้นหอม (หั่นท่อน)",
          ingredients12: "เห็ดหูหนู",
          measure1: "400 กรัม",
          measure2: "1 ช้อนโต๊ะ",
          measure3: "6 กลีบ",
          measure4: "2 ช้อนโต๊ะ",
          measure5: "1 ช้อนโต๊ะ",
          measure6: "1 ช้อนโต๊ะ",
          measure7: "1 ช้อนโต๊ะ",
          measure8: "2 ช้อนโต๊ะ",
          measure9: "160 กรัม",
          measure10: "1 เม็ด",
          measure11: "2 ต้น",
          measure12: "140 กรัม",
          introduce:
            "ต้มกะทิแบบโบราณ รสคล้ายต้มข่าแต่ไม่เปรี้ยว สูตรนี้มากับเนื้อแดดเดียวย่าง",
          categoryTh: "เนื้อไก่",
          categoryEn: "Chicken",
          typeTh: "กับข้าว",
          typeEn: "Side dish",
          recipeImage: "dist\\images\\stir_fried_chick.png",

          nutAllergy: "0",
          rating: "10.0",
        },
        {
          recipeName: "Salted Beef in Coconut Milk",
          cookingSteps:
            "1.นำเนื้อแดดเดียวมาย่างจนสุก หั่นเป็นชิ้น ทุบเล็กน้อย\n 2.ตั้งกะทิ และน้ำสะอาด พอเดือด ใส่หอมแดง ใบมะกรูด และกระชายซอย ปรุงรสด้วยซีอิ๊วขาว และน้ำตาลทราย\n 3.ใส่เนื้อลงไป ตามด้วยพริกขี้หนู ต้มให้เดือดอีกที ตักเสิร์ฟ",
          ingredients1: "เนื้อแดดเดียว",
          ingredients2: "กะทิ",
          ingredients3: "น้ำสะอาด",
          ingredients4: "หอมแดง (ซอย)",
          ingredients5: "ใบมะกรูด (ซอย)",
          ingredients6: "กระชาย (ซอย)",
          ingredients7: "ซีอิ๊วขาว",
          ingredients8: "น้ำตาลทราย",
          ingredients9: "พริกขี้หนู (บุบ)",
          measure1: "250 กรัม",
          measure2: "300 มิลลิลิตร",
          measure3: "200 มิลลิลิตร",
          measure4: "20 กรัม",
          measure5: "4 ใบ",
          measure6: "10 กรัม",
          measure7: "1 1/2 ช้อนโต๊ะ",
          measure8: "1 ช้อนชา",
          measure9: "6 เม็ด",
          introduce:
            "ต้มกะทิแบบโบราณ รสคล้ายต้มข่าแต่ไม่เปรี้ยว สูตรนี้มากับเนื้อแดดเดียวย่าง",
          categoryTh: "เนื้อวัว",
          categoryEn: "Beef",
          typeTh: "กับข้าว",
          typeEn: "Side dish",
          recipeImage: "dist\\images\\BeefCoMilk.jpg",
          nutAllergy: "0",
          rating: "10.0",
        },
        {
          recipeName: "Stir-fried Chick Bans",
          cookingSteps:
            "1.ผัดกระเทียมกับน้ำมันให้หอมและสุกดี ใส่เนื้อไก่ตามลงไป ผัดจนสุก\n 2.ปรุงด้วยซอสหอยนางรม ซอสปรุงรส ซีอิ๊วขาว พริกไทยขาวป่น และน้ำตาลทราย\n 3.ใส่หอมใหญ่ และพริกหยวก ผัดให้สุกดี\n 4.ปิดความร้อน ใส่ต้นหอมหั่นท่อน เคล้าให้เข้ากัน แล้วจัดเสิร์ฟ",
          ingredients1: "สะโพกไก่ (หั่นชิ้น)",
          ingredients2: "หอมใหญ่ (ซอยหนา)",
          ingredients3: "พริกหยวก (หั่นตามยาว)",
          ingredients4: "กระเทียมไทย (โขลก)",
          ingredients5: "ต้นหอม (หั่นท่อน)",
          ingredients6: "น้ำมันพืช",
          ingredients7: "ซอสหอยนางรม",
          ingredients8: "ซอสปรุงรส",
          ingredients9: "ซีอิ๊วขาว",
          ingredients10: "น้ำตาลทราย",
          ingredients11: "พริกไทยขาวป่น",
          measure1: "300 กรัม",
          measure2: "80 กรัม",
          measure3: "150 กรัม",
          measure4: "20 กรัม",
          measure5: "1 ต้น",
          measure6: "2 ช้อนโต๊ะ",
          measure7: "2 ช้อนโต๊ะ",
          measure8: "1 ช้อนชา",
          measure9: "1 1/2 ช้อนชา",
          measure10: "2 ช้อนชา",
          measure11: "1/2 ช้อนชา",
          introduce:
            "สะโพกไก่นุ่มๆ ผัดกับพริกหยวกสีสวย แถมมีเนื้อสัมผัสกรอบและรสหวาน รับประทานกับข้าวสวยร้อนๆ",
          categoryTh: "เนื้อไก่",
          categoryEn: "Chicken",
          typeTh: "กับข้าว",
          typeEn: "Side dish",
          recipeImage: "dist\\images\\StirChickBan.jpg",
          nutAllergy: "0",
          rating: "10.0",
          userId: "2",
        },
        {
          recipeName: "Deep-Fried Pork belly",
          cookingSteps:
            "1.หมักหมูสันนอก กับ เกลือ และพริกไทย คลุกผสมให้เข้ากัน หมักทิ้งไว้ 30 นาที\n 2.ตั้งกระทะใส่น้ำมัน ใช้ไฟกลางค่อยแรง นำหมูที่หมักไว้ลงไปทอดจนสุกเหลือง แล้วตักขึ้นสะเด็ดน้ำมันพักไว้\n 3.จัดใส่จานจัดเสิร์ฟ โรยด้วยต้นหอมซอย",
          ingredients1: "หมูสันนอกหั่นเส้น",
          ingredients2: "เกลือ",
          ingredients3: "พริกไทย",
          ingredients4: "น้ำมันสำหรับทอด",
          ingredients5: "ต้นหอมซอย สำหรับโรยตกแต่ง",
          measure1: "1/2 กิโลกรัม ",
          measure2: "2 ช้อนชา",
          measure3: "1/2 ช้อนชา",
          measure4: "2 ช้อนโต๊ะ",
          measure5: "1 ต้น",
          introduce:
            "เมนูทอดง่าย ๆ ที่สามารถกินฟิน ๆ ได้ทุกเพศ ทุกวัย กับเมนู “หมูทอดเกลือ” หมูทอดรสเข้ม กินคู่กับข้าวเหนียวเป็นอาหารเช้าก็ดี หรือจะทอดไว้กินเพลิน ๆ ยามมีปาร์ตี้ก็ไม่เลวเลย",
          categoryTh: "เนื้อหมู",
          categoryEn: "Pork",
          typeTh: "ของทอด",
          typeEn: "Fried",
          recipeImage: "dist\\images\\FriedPorkBel.jpg",
          nutAllergy: "0",
          rating: "10.0",
          userId: "2",
        },
        {
          recipeName: "Sweet Pork",
          cookingSteps:
            "1.เตรียมวัตถุดิบให้พร้อม\n 2.นำเนื้อสันนอกหมูไปล้างให้สะอาด จากนั้นนำมาหั่นเป็นชิ้นเล็กๆ ให้พอดีคำ\n 3.ตั้งกระทะใส่น้ำมันพืชลงไป ใส่กระเทียมสับ ใส่เนื้อหมูลงไปผัดให้สุก ปรุงรสด้วยซอสหอยนางรม น้ำตาลทราย ซอสถั่วเหลือง น้ำมันงา พริกไทยป่น เติมน้ำเปล่า ซีอิ๊วดำลงไปผัดให้ทุกอย่างเข้ากัน รอให้น้ำตาลละลายและเริ่มเข้มข้นเป็นอันเสร็จพร้อมเสิร์ฟรับประทาน",
          ingredients1: "หมูสามชั้น",
          ingredients2: "สะโพกหมู",
          ingredients3: "ซีอิ้วขาว",
          ingredients4: "ซีอิ้วดำ",
          ingredients5: "ซีอิ้วดำหวาน",
          ingredients6: "น้ำมันหอย",
          ingredients7: "น้ำตาลทราย",
          ingredients8: "น้ำตาลปี๊บ",
          ingredients9: "หอมแดง",
          ingredients10: "น้ำมันพืช",
          measure1: "300 กรัม ",
          measure2: "200 กรัม",
          measure3: "2 ช้อนโต๊ะ",
          measure4: "1 ช้อนโต๊ะ",
          measure5: "2 ช้อนโต๊ะ",
          measure6: "2 ช้อนโต๊ะ ",
          measure7: "1 ช้อนโต๊ะ",
          measure8: "3 ช้อนโต๊ะ",
          measure9: "4 หัว",
          measure10: "2 ช้อนโต๊ะ",
          introduce:
            "เป็นที่รู้กันว่า “หมูหวาน” กินกับอะไรก็ดีไปหมด ไม่ว่าจะเป็น ข้าวต้ม ข้าวสวย ข้าวเหนียว หรือข้าวคลุกกะปิก็เด็ดดวง ด้วยเนื้อหมูที่นำไปหมักและเคี่ยวจนนุ่มลิ้น ได้รสชาติเค็มนิด ๆ หวานหน่อย ๆ กลมกล่อมเข้าเนื้อสุด ๆ",
          categoryTh: "เนื้อหมู",
          categoryEn: "Pork",
          typeTh: "กับข้าว",
          typeEn: "Side dish",
          recipeImage: "dist\\images\\SweetBel.jpg",
          video: "-",
          nutAllergy: "0",
          rating: "10.0",
          userId: "2",
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

//start server
app.listen(port, () =>
  console.log(`[server] listening on: ${ip.address()}:${port}`)
);
