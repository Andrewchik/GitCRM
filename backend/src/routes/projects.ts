import { Router } from 'express';
import mongoose from 'mongoose'; // ⬅️ додай
import Project from '../models/Project';
import { fetchRepo } from '../services/github';
import type { AuthedRequest } from '../middleware/auth';

const router = Router();

// GET /projects
router.get('/', async (req: AuthedRequest, res) => {
  try {
    const userId = req.user!.id;
    const items = await Project.find({ userId }).sort({ createdAt: -1 }).lean();
    const out = items.map((o: any) => ({ ...o, id: String(o._id), _id: undefined, __v: undefined }));
    return res.json(out);
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Failed to load projects' });
  }
});

// POST /projects
router.post('/', async (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const repoPath: string = (req.body?.repoPath || '').trim();
  if (!/^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(repoPath)) {
    return res.status(400).json({ message: 'Invalid repoPath. Use "owner/name"' });
  }

  try {
    const data = await fetchRepo(repoPath);
    const doc = await Project.findOneAndUpdate(
      { userId, repoFullName: data.repoFullName },
      { userId, ...data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const o: any = doc.toObject();
    o.id = String(o._id); delete o._id; delete o.__v;
    return res.json(o);
  } catch (e: any) {
    const msg = String(e?.message || '');
    const code = msg.includes('GitHub 404') ? 404 : 400;
    return res.status(code).json({ message: msg || 'Failed to add repo' });
  }
});

// PATCH /projects/:id/refresh
router.patch('/:id/refresh', async (req: AuthedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const p = await Project.findOne({ _id: id, userId });
    if (!p) return res.sendStatus(404);

    const data = await fetchRepo(p.repoFullName);
    Object.assign(p, data);
    await p.save();

    const o: any = p.toObject();
    o.id = String(o._id); delete o._id; delete o.__v;
    return res.json(o);
  } catch (e: any) {
    return res.status(400).json({ message: e.message || 'Refresh failed' });
  }
});

// DELETE /projects/:id
router.delete('/:id', async (req: AuthedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid project id' });
    }
    const r = await Project.deleteOne({ _id: id, userId });
    if (r.deletedCount === 0) return res.sendStatus(404);
    return res.sendStatus(204);
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Delete failed' });
  }
});

export default router;
