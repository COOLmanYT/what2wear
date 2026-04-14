import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDevEmails } from "@/lib/dev-auth";
import fs from "fs";
import path from "path";

function getChangelogPath(): string {
  const candidates = [
    path.join(process.cwd(), "changelog.json"),
    path.join(process.cwd(), "../../changelog.json"),
    path.join(process.cwd(), "../changelog.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

export interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  description: string;
  large?: boolean;
  showOnNextLogin?: boolean;
  ctaLabel?: string;
  ctaLink?: string;
  imageUrl?: string;
}

async function checkAuth(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) return false;
  return getDevEmails().has(session.user.email.toLowerCase());
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const p = getChangelogPath();
    const data: ChangelogEntry[] = JSON.parse(fs.readFileSync(p, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const entry: ChangelogEntry = await req.json();
    if (!entry.version?.trim() || !entry.title?.trim()) {
      return NextResponse.json({ error: "version and title are required" }, { status: 400 });
    }
    const p = getChangelogPath();
    const data: ChangelogEntry[] = JSON.parse(fs.readFileSync(p, "utf-8"));
    if (data.some((e) => e.version === entry.version)) {
      return NextResponse.json({ error: `Version ${entry.version} already exists` }, { status: 409 });
    }
    data.unshift(entry);
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const entry: ChangelogEntry = await req.json();
    const p = getChangelogPath();
    const data: ChangelogEntry[] = JSON.parse(fs.readFileSync(p, "utf-8"));
    const idx = data.findIndex((e) => e.version === entry.version);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data[idx] = entry;
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { version } = await req.json();
    const p = getChangelogPath();
    const data: ChangelogEntry[] = JSON.parse(fs.readFileSync(p, "utf-8"));
    const filtered = data.filter((e) => e.version !== version);
    fs.writeFileSync(p, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
