import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";

// Initialize Firebase Admin SDK only if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

// Handle DELETE request
export async function DELETE(request) {
  const body = await request.json();
  const { email } = body;

  // Validate email input
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Get the user by email
    const user = await getAuth().getUserByEmail(email);

    // Delete the user from Firebase Auth
    await getAuth().deleteUser(user.uid);

    // Send success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // If the user doesn't exist, return success (idempotent behavior)
    if (error.code === "auth/user-not-found") {
      return NextResponse.json({
        success: true,
        message: "User not found, no action taken.",
      });
    }

    // Log the error for debugging
    console.error("Error deleting user:", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to delete user. " + error.message },
      { status: 500 },
    );
  }
}
