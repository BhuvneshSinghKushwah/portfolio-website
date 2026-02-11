import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { contactLimiter } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const { success } = await contactLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString();
      if (field) errors[field] = issue.message;
    });
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ message: "Thanks!" }, { status: 200 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }

  return NextResponse.json({ message: "Message sent successfully!" });
}
