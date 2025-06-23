import { db } from "@/app/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_, { params }) {
	try {
		const userRef = doc(db, "Auth", await params.id);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			return NextResponse.json(
				{ success: false, message: "Reviewer not found" },
				{ status: 404 },
			);
		}

		const userData = userSnap.data();
		const normalizedDepartment =
			userData.role === "Reviewer"
				? Array.isArray(userData.department)
					? userData.department
					: [userData.department].filter(Boolean)
				: userData.department || "";

		return NextResponse.json({
			success: true,
			reviewer: { ...userData, department: normalizedDepartment },
		});
	} catch (error) {
		console.error("Error getting reviewer info:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}
