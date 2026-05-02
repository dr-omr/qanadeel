import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const REVIEWS_FILE = path.join(process.cwd(), "src", "data", "reviews.json");

export type Review = {
  id: string;
  name: string;
  stage: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
};

async function readReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(REVIEWS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeReviews(reviews: Review[]) {
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}

export async function GET() {
  const reviews = await readReviews();
  // Only return approved reviews
  return NextResponse.json(reviews.filter(r => r.approved));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, stage, rating, text } = body;

    if (!name?.trim() || !text?.trim() || !rating) {
      return NextResponse.json({ success: false, error: "بيانات ناقصة" }, { status: 400 });
    }

    const reviews = await readReviews();
    const newReview: Review = {
      id: `r-${Date.now()}`,
      name: String(name).trim(),
      stage: String(stage || "ولي أمر").trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      text: String(text).trim(),
      date: new Date().toLocaleDateString("ar-OM", { year: "numeric", month: "long" }),
      approved: true, // auto-approve — change to false for manual moderation
    };

    reviews.unshift(newReview);
    await writeReviews(reviews);

    return NextResponse.json({ success: true, review: newReview });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "خطأ في الحفظ" }, { status: 500 });
  }
}
