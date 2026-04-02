import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Holy Bible (RSV Catholic Edition)",
    price: 1200,
    category: "books",
    stock: 12,
    badge: "Best Seller",
    rating: 5,
    description:
      "The Revised Standard Version Catholic Edition is a faithful and accurate translation of the Holy Scriptures, including the deuterocanonical books.",
    details: [
      "Hardcover, 1800 pages",
      "Includes maps and concordance",
      "Publisher: Ignatius Press",
      "Language: English",
    ],
  },
  {
    name: "Catechism of the Catholic Church",
    price: 1500,
    category: "books",
    stock: 8,
    badge: "Best Seller",
    rating: 5,
    description:
      "The official Catechism presents a complete and systematic account of the faith of the Catholic Church. Essential for every Catholic home.",
    details: [
      "Hardcover, 904 pages",
      "Second Edition",
      "Publisher: Libreria Editrice Vaticana",
      "Language: English",
    ],
  },
  {
    name: "Daily Roman Missal",
    price: 2200,
    category: "books",
    stock: 5,
    badge: null,
    rating: 4,
    description:
      "The complete guide to the Roman Rite of the Mass in both English and Latin. Perfect for following the daily liturgy.",
    details: [
      "Leather-bound, 2400 pages",
      "Bilingual: English & Latin",
      "Ribbon markers included",
    ],
  },
  {
    name: "Introduction to Christianity",
    price: 980,
    category: "books",
    stock: 15,
    badge: "Popular",
    rating: 4,
    description:
      "A classic work by Pope Emeritus Benedict XVI exploring the meaning of the Apostles Creed.",
    details: [
      "Paperback, 320 pages",
      "Author: Joseph Ratzinger",
      "Publisher: Ignatius Press",
    ],
  },
  {
    name: "The Story of a Soul – St Therese",
    price: 750,
    category: "books",
    stock: 20,
    badge: null,
    rating: 5,
    description:
      "The autobiography of St Therese of Lisieux. Her Little Way of spiritual childhood has inspired millions worldwide.",
    details: [
      "Paperback, 268 pages",
      "Author: St Therese of Lisieux",
      "Publisher: TAN Books",
    ],
  },
  {
    name: "Divine Mercy in My Soul",
    price: 890,
    category: "books",
    stock: 10,
    badge: "Popular",
    rating: 4,
    description:
      "The Diary of Saint Maria Faustina Kowalska recording all her encounters with Jesus and His message of Divine Mercy.",
    details: [
      "Hardcover, 750 pages",
      "Author: St Faustina Kowalska",
      "Publisher: Marian Press",
    ],
  },
  {
    name: "Wooden Rosary Beads",
    price: 450,
    category: "articles",
    stock: 30,
    badge: "Popular",
    rating: 5,
    description:
      "Handcrafted wooden rosary beads, smooth to the touch and durable for daily prayer. Comes in a beautiful gift pouch.",
    details: [
      "Material: Natural olive wood",
      "Bead size: 8mm",
      "Length: 48cm",
      "Includes gift pouch",
    ],
  },
  {
    name: "Crucifix – Wall Mount (30cm)",
    price: 950,
    category: "articles",
    stock: 7,
    badge: null,
    rating: 4,
    description:
      "A beautifully crafted wall-mount crucifix ideal for the home, office, or chapel. Made from solid resin with gold-tone finish.",
    details: [
      "Material: Resin & metal",
      "Size: 30cm x 18cm",
      "Finish: Antique gold",
      "Includes wall mount fittings",
    ],
  },
  {
    name: "Miraculous Medal (Silver)",
    price: 300,
    category: "articles",
    stock: 50,
    badge: "Popular",
    rating: 5,
    description:
      "The Miraculous Medal as revealed to St Catherine Laboure in 1830. Sterling silver finish with detailed relief of Our Lady.",
    details: [
      "Material: Sterling silver plated",
      "Size: 2cm diameter",
      "Includes 50cm chain",
      "Comes in gift box",
    ],
  },
  {
    name: "St Benedict Medal",
    price: 350,
    category: "articles",
    stock: 25,
    badge: null,
    rating: 4,
    description:
      "One of the oldest and most powerful sacramentals of the Church, used for protection against evil.",
    details: [
      "Material: Zinc alloy",
      "Size: 3cm diameter",
      "Antique silver finish",
      "Includes prayer card",
    ],
  },
  {
    name: "Holy Water Bottle",
    price: 200,
    category: "articles",
    stock: 40,
    badge: null,
    rating: 3,
    description:
      "A durable plastic holy water bottle shaped as Our Lady of Lourdes. Perfect for home, car, or travel.",
    details: [
      "Material: BPA-free plastic",
      "Capacity: 200ml",
      "Height: 15cm",
      "Colour: White & blue",
    ],
  },
  {
    name: "Priest Vestment Set",
    price: 8500,
    category: "articles",
    stock: 3,
    badge: "New",
    rating: 5,
    description:
      "A complete liturgical vestment set for priests, handcrafted with premium fabric. Includes chasuble, stole, maniple, chalice veil and burse.",
    details: [
      "Fabric: Premium polyester blend",
      "Colours: White, Red, Green, Purple",
      "Fully lined",
    ],
  },
  {
    name: "Divine Mercy Novena CD",
    price: 800,
    category: "av",
    stock: 18,
    badge: "New",
    rating: 5,
    description:
      "A beautiful audio recording of the complete Divine Mercy Novena guided by a Catholic priest. Includes the Chaplet and daily reflections.",
    details: [
      "Format: Audio CD",
      "Duration: 3 hours 20 minutes",
      "Language: English",
      "Tracks: 15",
    ],
  },
  {
    name: "Gregorian Chant DVD",
    price: 700,
    category: "av",
    stock: 9,
    badge: null,
    rating: 4,
    description:
      "Experience the ancient beauty of Gregorian chant with this professionally recorded DVD from a Benedictine monastery.",
    details: [
      "Format: DVD (Region-free)",
      "Duration: 2 hours 10 minutes",
      "Language: Latin with English subtitles",
    ],
  },
  {
    name: "Rosary Audio USB (All Mysteries)",
    price: 1100,
    category: "av",
    stock: 22,
    badge: "Popular",
    rating: 5,
    description:
      "A USB flash drive containing all four mysteries of the Rosary — Joyful, Luminous, Sorrowful, and Glorious.",
    details: [
      "Format: MP3 on USB drive",
      "Storage: 8GB USB",
      "Total duration: 4 hours",
      "Language: English",
    ],
  },
  {
    name: "Catholic Mass Explained DVD",
    price: 650,
    category: "av",
    stock: 14,
    badge: "New",
    rating: 4,
    description:
      "An educational DVD walking viewers through every part of the Holy Mass. Excellent for RCIA, youth groups, and families.",
    details: [
      "Format: DVD (Region-free)",
      "Duration: 1 hour 45 minutes",
      "Language: English",
      "Includes study guide booklet",
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    // Clear existing products
    await Product.deleteMany();
    console.log("Existing products cleared...");

    // Insert all products
    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeder error:", error.message);
    process.exit(1);
  }
};

seedDB();
