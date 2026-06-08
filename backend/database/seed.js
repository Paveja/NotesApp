/**
 * seed.js - Populate the database with sample notes for development.
 * Run with: node database/seed.js
 */

require('dotenv').config({ path: '../.env' });
const { getDb } = require('../config/db');

const sampleNotes = [
  {
    title: 'Welcome to Notes App! 👋',
    content:
      'This is your personal notes application. You can create, edit, delete, and search notes. Try clicking the + button to create your first note!',
  },
  {
    title: 'Meeting Agenda - Q3 Planning',
    content:
      '1. Review Q2 KPIs\n2. Set Q3 OKRs\n3. Budget allocation discussion\n4. Team headcount review\n5. Product roadmap alignment\n\nAttendees: Alice, Bob, Carol, Dave',
  },
  {
    title: 'Recipe: Chocolate Chip Cookies 🍪',
    content:
      'Ingredients:\n- 2 1/4 cups flour\n- 1 tsp baking soda\n- 1 tsp salt\n- 1 cup butter (softened)\n- 3/4 cup granulated sugar\n- 3/4 cup brown sugar\n- 2 large eggs\n- 2 tsp vanilla extract\n- 2 cups chocolate chips\n\nBake at 375°F for 9–11 minutes.',
  },
  {
    title: 'Book List 📚',
    content:
      'Currently reading:\n- Atomic Habits - James Clear\n\nUp next:\n- The Pragmatic Programmer\n- Clean Code\n- Deep Work\n- Thinking, Fast and Slow',
  },
  {
    title: 'Project Ideas',
    content:
      '1. Build a habit tracker app\n2. Create a CLI tool for git shortcuts\n3. Write a blog about web performance\n4. Contribute to an open-source project\n5. Learn Rust by building a JSON parser',
  },
  {
    title: 'Daily Standup Template',
    content:
      'What did I do yesterday?\n→ \n\nWhat will I do today?\n→ \n\nAny blockers?\n→ None',
  },
];

function seed() {
  const db = getDb();

  // Clear existing data
  db.exec('DELETE FROM notes');
  db.exec('DELETE FROM sqlite_sequence WHERE name="notes"');

  const insert = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');

  const insertMany = db.transaction((notes) => {
    for (const note of notes) {
      insert.run(note.title, note.content);
    }
  });

  insertMany(sampleNotes);
  console.log(`✅  Seeded ${sampleNotes.length} sample notes into the database.`);
}

seed();
