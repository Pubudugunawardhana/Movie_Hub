const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const Actor = require('./models/Actor');
const Movie = require('./models/Movie');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const categoriesData = [
  { category_id: 1, name: 'Action' },
  { category_id: 2, name: 'Comedy' },
  { category_id: 3, name: 'Drama' },
  { category_id: 4, name: 'Sci-Fi' },
  { category_id: 5, name: 'Horror' },
  { category_id: 6, name: 'Fantasy' },
  { category_id: 7, name: 'Romance' },
  { category_id: 8, name: 'Thriller' },
  { category_id: 9, name: 'Adventure' },
  { category_id: 10, name: 'Animation' },
  { category_id: 11, name: 'Family' }
];

const actorsData = [
  { actor_id: 62, name: 'Abhishek Bachchan' },
  { actor_id: 63, name: 'Harleen Sethi' },
  { actor_id: 64, name: 'Prabhu-deva' },
  { actor_id: 65, name: 'shhid kapoor' },
  { actor_id: 66, name: 'Pooja Hegde' },
  { actor_id: 67, name: 'Joju George' },
  { actor_id: 68, name: 'david corenwet' },
  { actor_id: 69, name: 'Sachira Wijesinghe' },
  { actor_id: 71, name: 'Mason Thames' },
  { actor_id: 72, name: 'Saif Ali Khan' },
  { actor_id: 73, name: 'Arjun Kapoor' },
  { actor_id: 74, name: 'Jacqueline Fernandez' },
  { actor_id: 75, name: 'Dulquer Salmaan' },
  { actor_id: 76, name: 'Nithya Menen' },
  { actor_id: 77, name: 'Aju Varghese' },
  { actor_id: 78, name: 'Vineeth' },
  { actor_id: 79, name: 'Ryan Gosling' },
  { actor_id: 80, name: 'Rachel McAdams' },
  { actor_id: 81, name: 'James Marsden' },
  { actor_id: 82, name: 'Paul Johansson' },
  { actor_id: 83, name: 'Vera Farmiga' },
  { actor_id: 84, name: 'Patrick Wilson' },
  { actor_id: 85, name: 'Lili Taylor' },
  { actor_id: 86, name: 'Shanley Caswell' },
  { actor_id: 87, name: 'Jayalath Manoratne' },
  { actor_id: 88, name: 'Umali Thilakaratne' },
  { actor_id: 89, name: 'Thumindu Dodantenna' },
  { actor_id: 90, name: 'Pooja Hegde' },
  { actor_id: 91, name: 'Pavail Gulati' },
  { actor_id: 92, name: 'Suriya' },
  { actor_id: 93, name: 'Suriya' },
  { actor_id: 94, name: 'Jayaram' },
  { actor_id: 95, name: 'Prem Kumar' },
  { actor_id: 96, name: 'Anthony Carrigan' },
  { actor_id: 97, name: 'Isabela Merced' },
  { actor_id: 98, name: 'Wendell Pierce' },
  { actor_id: 99, name: 'Nico Parker' },
  { actor_id: 100, name: 'Peter Serafinowicz' },
  { actor_id: 101, name: 'Bronwyn James' }
];

const moviesData = [
  { movie_id: 29, title: 'Be Happy', release_date: new Date('2025-03-14'), summary: 'The journey of a single father and his talented daughter who aspire to perform on the country\'s biggest dance reality show.', director: 'Remo D\'Souza', runtime_minutes: 130, trailer_url: 'https://youtu.be/neApkeqVj4w?si=obqYxCUwjio2UYke', category_id: 11, language: 'Hindi' },
  { movie_id: 30, title: 'Deva', release_date: new Date('2024-12-31'), summary: 'A police officer investigates the murder of his close friend. However, he suffers a traumatic accident that wipes away his memory, jeopardising the investigation.', director: 'Rosshan Andrrews', runtime_minutes: 130, trailer_url: 'https://www.youtube.com/watch?v=3x77q40hATw', category_id: 1, language: 'Hindi' },
  { movie_id: 31, title: 'Retro', release_date: new Date('2025-05-01'), summary: 'A gangster tries to avoid violence and lead a peaceful life after vowing to his wife.', director: 'Karthik Subbaraj', runtime_minutes: 168, trailer_url: 'https://www.youtube.com/watch?v=ZnH_2I0WoFQ', category_id: 1, language: 'Tamil' },
  { movie_id: 32, title: 'Superman', release_date: new Date('2025-07-11'), summary: 'A reboot of the Superman franchise—Clark Kent (David Corenswet) halts a war, but faces backlash and must regain public trust. With support from Lois Lane and fellow heroes, he uncovers Lex Luthor’s manipulations and navigates moral and societal complexities.', director: 'James Gunn', runtime_minutes: 129, trailer_url: 'https://www.youtube.com/watch?v=Ox8ZLF6cGM0', category_id: 1, language: 'English' },
  { movie_id: 33, title: 'A-Level', release_date: new Date('2017-02-07'), summary: 'After getting through the O/L Examination with outstanding results, Anuththara with his friends eagerly look forward to experience their final years in school as seniors in the A/L class.', director: 'Rohan Perera', runtime_minutes: 140, trailer_url: 'https://www.youtube.com/watch?v=UK27_yg9Ry8', category_id: 11, language: 'Sinhala' },
  { movie_id: 34, title: 'How to Train Your Dragon', release_date: new Date('2025-06-13'), summary: 'On the rugged isle of Berk, where Vikings and dragons have long been enemies, inventive teen Hiccup befriends a rare Night Fury dragon named Toothless. Their bond challenges Viking traditions and the very foundations of Viking society', director: 'Dean DeBlois', runtime_minutes: 125, trailer_url: 'https://youtu.be/22w7z_lT6YM?si=zNLHxxk8z8t_xHnh', category_id: 9, language: 'English' },
  { movie_id: 35, title: 'Bhoot Police', release_date: new Date('2021-09-10'), summary: 'Two brothers, Vibhooti and Chiraunji, have fought for their share of ghosts. A new case forces them to rethink their own abilities and beliefs.', director: 'Pawan Kripalani', runtime_minutes: 129, trailer_url: 'https://www.youtube.com/embed/oBpG-qSd9lM', category_id: 2, language: 'Hindi' },
  { movie_id: 36, title: '100 Days of Love', release_date: new Date('2015-02-01'), summary: 'Despite their strained history as children, a columnist falls in love with his schoolmate when they meet after years. Just as he decides to win her heart, he learns that she is engaged to another man.', director: 'Januse Mohammed Majeed', runtime_minutes: 155, trailer_url: 'https://www.youtube.com/embed/q23px5zEnXk', category_id: 7, language: 'Hindi' },
  { movie_id: 37, title: 'The Notebook', release_date: new Date('2004-02-06'), summary: 'When Evelyn Salt (Angelina Jolie) became a CIA officer, she swore an oath to duty, honor and country. But, when a defector accuses her of being a Russian spy, Salt\'s oath is put to the test. Now a fugitive, Salt must use every skill gained from years of training and experience to evade capture, but the more she tries to prove her innocence, the more guilty she seems.', director: 'Nick Cassavetes', runtime_minutes: 123, trailer_url: 'https://www.youtube.com/embed/BjJcYdEOI0k', category_id: 7, language: 'English' },
  { movie_id: 38, title: 'The Conjuring', release_date: new Date('2013-01-07'), summary: 'In 1970, paranormal investigators and demonologist...', director: 'James Wan', runtime_minutes: 112, trailer_url: 'https://www.youtube.com/embed/h9Q4zZS2v1k', category_id: 5, language: 'English' }
];

const actormovielink = [
  { movie_id: 29, actor_id: 62 }, { movie_id: 29, actor_id: 63 }, { movie_id: 29, actor_id: 64 },
  { movie_id: 30, actor_id: 65 }, { movie_id: 30, actor_id: 66 }, { movie_id: 30, actor_id: 90 }, { movie_id: 30, actor_id: 91 },
  { movie_id: 31, actor_id: 67 }, { movie_id: 31, actor_id: 93 }, { movie_id: 31, actor_id: 94 }, { movie_id: 31, actor_id: 95 },
  { movie_id: 32, actor_id: 68 }, { movie_id: 32, actor_id: 96 }, { movie_id: 32, actor_id: 97 }, { movie_id: 32, actor_id: 98 },
  { movie_id: 33, actor_id: 69 }, { movie_id: 33, actor_id: 87 }, { movie_id: 33, actor_id: 88 }, { movie_id: 33, actor_id: 89 },
  { movie_id: 34, actor_id: 71 }, { movie_id: 34, actor_id: 99 }, { movie_id: 34, actor_id: 100 }, { movie_id: 34, actor_id: 101 },
  { movie_id: 35, actor_id: 72 }, { movie_id: 35, actor_id: 73 }, { movie_id: 35, actor_id: 74 },
  { movie_id: 36, actor_id: 75 }, { movie_id: 36, actor_id: 76 }, { movie_id: 36, actor_id: 77 }, { movie_id: 36, actor_id: 78 },
  { movie_id: 37, actor_id: 79 }, { movie_id: 37, actor_id: 80 }, { movie_id: 37, actor_id: 81 }, { movie_id: 37, actor_id: 82 },
  { movie_id: 38, actor_id: 83 }, { movie_id: 38, actor_id: 84 }, { movie_id: 38, actor_id: 85 }, { movie_id: 38, actor_id: 86 }
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Actor.deleteMany({});
    await Movie.deleteMany({});

    console.log('Existing data cleared');

    // Seed Users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create([
      { name: 'Admin', email: 'admin@filmmania.com', password: adminPassword, subscribed: true, isAdmin: true },
      { name: 'example', email: 'example@gmail.com', password: userPassword, subscribed: false, isAdmin: false }
    ]);
    console.log('Users seeded');

    // Seed Categories
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log('Categories seeded');

    // Seed Actors
    const insertedActors = await Actor.insertMany(actorsData);
    console.log('Actors seeded');

    // Seed Movies mapping category and actors
    const moviesToInsert = moviesData.map(movie => {
      const category = insertedCategories.find(c => c.category_id === movie.category_id);
      
      // Find actors for this movie
      const movieActorsIds = actormovielink.filter(link => link.movie_id === movie.movie_id).map(link => link.actor_id);
      const actors = insertedActors.filter(a => movieActorsIds.includes(a.actor_id)).map(a => a._id);

      return {
        movie_id: movie.movie_id,
        title: movie.title,
        release_date: movie.release_date,
        summary: movie.summary,
        director: movie.director,
        runtime_minutes: movie.runtime_minutes,
        trailer_url: movie.trailer_url,
        category: category ? category._id : null,
        language: movie.language,
        actors: actors
      };
    });

    await Movie.insertMany(moviesToInsert);
    console.log('Movies seeded');

    console.log('Data migration successful!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
