const mongoose = require('mongoose');
const https = require('https');

mongoose.connect('mongodb://pubudugunawardhana23_db_user:moviehub123@ac-ai8kmr8-shard-00-00.5afsgy6.mongodb.net:27017,ac-ai8kmr8-shard-00-01.5afsgy6.mongodb.net:27017,ac-ai8kmr8-shard-00-02.5afsgy6.mongodb.net:27017/moviehub?ssl=true&authSource=admin&retryWrites=true&w=majority');

const Actor = mongoose.model('Actor', new mongoose.Schema({ name: String, photo_url: String }));

const options = {
  headers: {
    'User-Agent': 'MovieHub/1.0 (contact@moviehub.com)'
  }
};

async function searchWikiPage(query) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=1`;
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.search && json.query.search.length > 0) {
            resolve(json.query.search[0].title);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function fetchWikiImage(title) {
  return new Promise((resolve, reject) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=500&format=json`;
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function downloadToBase64(imageUrl) {
  return new Promise((resolve) => {
    https.get(imageUrl, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
         downloadToBase64(res.headers.location).then(resolve);
         return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || 'image/jpeg';
        resolve(`data:${contentType};base64,${buffer.toString('base64')}`);
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const actors = await Actor.find({ $or: [{ photo_url: { $exists: false } }, { photo_url: null }, { photo_url: '' }] });
  console.log(`Found ${actors.length} actors missing photos.`);
  
  for (const actor of actors) {
    console.log(`Searching wiki for ${actor.name}...`);
    const title = await searchWikiPage(actor.name);
    
    if (title) {
      const imageUrl = await fetchWikiImage(title);
      if (imageUrl) {
        console.log(`Found image: ${imageUrl}. Downloading...`);
        const base64 = await downloadToBase64(imageUrl);
        if (base64) {
          actor.photo_url = base64;
          await actor.save();
          console.log(`Updated ${actor.name}`);
        }
      } else {
        console.log(`No Wikipedia image found for title: ${title}`);
      }
    } else {
      console.log(`No Wikipedia page found for ${actor.name}`);
    }
  }
  
  console.log('Done.');
  process.exit(0);
}

run();
