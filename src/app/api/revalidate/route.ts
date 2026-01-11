import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("secret");
    const tag = request.nextUrl.searchParams.get("tag");

    if (token !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json(
        { message: "Missing tag param" },
        { status: 400 }
      );
    }

    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error revalidating" },
      { status: 500 }
    );
  }
}
