import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { authenticate, requireRole, asyncHandler } from '../../middleware';
import type { RequestHandler } from 'express';

const router = Router();

// Resolve to backend/data regardless of CWD (works in dist and src)
const DATA_DIR = path.join(__dirname, '../../../data');
const PERMISSIONS_FILE = path.join(DATA_DIR, 'permissions.json');
const DOCS_FILE = path.join(__dirname, '../../../../docs/ROLES.md');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function toYesNo(val: boolean | undefined) {
  return val ? 'Yes' : 'No';
}

async function updateRolesDoc(permissions: any) {
  try {
    const content = await fs.readFile(DOCS_FILE, 'utf8');
    const start = '<!-- START_MATRIX';
    const end = '<!-- END_MATRIX -->';
    const startIdx = content.indexOf(start);
    const endIdx = content.indexOf(end);
    if (startIdx === -1 || endIdx === -1) return; // markers not found, skip

    const header =
      '| Feature | Admin | Consultant | Teacher | Data Scientist |\n' +
      '|---|---|---|---|---|\n';

    const features: string[] = [
      'users.manage',
      'students.viewAll',
      'students.create',
      'students.update',
      'students.delete',
      'students.export',
      'students.import',
      'records.viewAll',
      'records.create',
      'records.update',
      'records.delete',
      'sessions.manageOwn',
      'analytics.viewAll',
      'mlModels.manage',
      'datasets.manage'
    ];

    const lines = features
      .map((f) => {
        const consultant = toYesNo(permissions?.consultant?.[f]);
        const teacher = toYesNo(permissions?.teacher_supervisor?.[f]);
        const dataSci = toYesNo(permissions?.data_scientist?.[f]);
        return `| ${f} | Yes | ${consultant} | ${teacher} | ${dataSci} |`;
      })
      .join('\n');

    const newMatrix = `${start} (auto-generated; do not edit rows below manually) -->\n${header}${lines}\n${end}`;

    const updated =
      content.slice(0, startIdx) + newMatrix + content.slice(endIdx + end.length);
    await fs.writeFile(DOCS_FILE, updated, 'utf8');
  } catch {
    // Silent fail; docs update is best-effort
  }
}

const getPermissions: RequestHandler = async (_req, res) => {
  await ensureDataDir();
  try {
    const content = await fs.readFile(PERMISSIONS_FILE, 'utf8');
    const json = JSON.parse(content);
    res.json({ permissions: json });
  } catch {
    // default if file not present
    res.json({ permissions: {} });
  }
};

const setPermissions: RequestHandler = async (req, res) => {
  await ensureDataDir();
  const body = req.body as { permissions?: unknown };
  if (!body || typeof body !== 'object' || body.permissions === undefined) {
    res.status(400).json({ message: 'Invalid body' });
    return;
  }
  const content = JSON.stringify(body.permissions, null, 2);
  await fs.writeFile(PERMISSIONS_FILE, content, 'utf8');
  await updateRolesDoc(body.permissions);
  res.status(204).end();
};

router.get(
  '/permissions',
  authenticate,
  requireRole(['admin'] as any),
  asyncHandler(getPermissions)
);

router.post(
  '/permissions',
  authenticate,
  requireRole(['admin'] as any),
  asyncHandler(setPermissions)
);

export const adminRouter = router;


