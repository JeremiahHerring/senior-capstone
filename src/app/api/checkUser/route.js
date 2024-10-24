import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";

// Initialize Firebase Admin SDK only if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

export async function POST(request) {
  const body = await request.json();
  const { email } = body;

  try {
    // Fetch the user by email
    const user = await getAuth().getUserByEmail(email);
    return NextResponse.json({ auth: true, user });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return NextResponse.json({ auth: false });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
