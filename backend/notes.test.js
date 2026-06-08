/**
 * notes.test.js - Unit tests for the Notes API
 * Run with: npm test
 */

const request = require('supertest');
const app = require('../server');

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('Notes API', () => {
  let createdNoteId;

  // ── Health check ────────────────────────────────────────────────────────────
  describe('GET /health', () => {
    it('should return status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // ── Create note ─────────────────────────────────────────────────────────────
  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const res = await request(app).post('/api/notes').send({
        title: 'Test Note',
        content: 'Test content for unit testing',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe('Test Note');
      createdNoteId = res.body.data.id; // Save for later tests
    });

    it('should reject a note with missing title', async () => {
      const res = await request(app).post('/api/notes').send({ content: 'No title here' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('Title is required.');
    });

    it('should reject a note with missing content', async () => {
      const res = await request(app).post('/api/notes').send({ title: 'No content' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Content is required.');
    });

    it('should reject a title longer than 200 characters', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({ title: 'A'.repeat(201), content: 'valid content' });
      expect(res.statusCode).toBe(400);
    });
  });

  // ── Get all notes ────────────────────────────────────────────────────────────
  describe('GET /api/notes', () => {
    it('should return an array of notes', async () => {
      const res = await request(app).get('/api/notes');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should search notes with ?q= parameter', async () => {
      const res = await request(app).get('/api/notes?q=Test Note');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // ── Get single note ──────────────────────────────────────────────────────────
  describe('GET /api/notes/:id', () => {
    it('should return a single note by id', async () => {
      const res = await request(app).get(`/api/notes/${createdNoteId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe(createdNoteId);
    });

    it('should return 404 for a non-existent note', async () => {
      const res = await request(app).get('/api/notes/999999');
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 for an invalid id', async () => {
      const res = await request(app).get('/api/notes/abc');
      expect(res.statusCode).toBe(400);
    });
  });

  // ── Update note ──────────────────────────────────────────────────────────────
  describe('PUT /api/notes/:id', () => {
    it('should update an existing note', async () => {
      const res = await request(app).put(`/api/notes/${createdNoteId}`).send({
        title: 'Updated Test Note',
        content: 'Updated content',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Updated Test Note');
    });

    it('should return 404 when updating a non-existent note', async () => {
      const res = await request(app)
        .put('/api/notes/999999')
        .send({ title: 'Ghost', content: 'Nowhere' });
      expect(res.statusCode).toBe(404);
    });
  });

  // ── Delete note ──────────────────────────────────────────────────────────────
  describe('DELETE /api/notes/:id', () => {
    it('should delete an existing note', async () => {
      const res = await request(app).delete(`/api/notes/${createdNoteId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 when deleting a non-existent note', async () => {
      const res = await request(app).delete(`/api/notes/${createdNoteId}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
