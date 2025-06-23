import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";

export async function POST(req, { params }) {
	try {
		const proposalId = await params.id;
		const { replyText, proposerName } = await req.json();

		if (!replyText || !proposerName) {
			return NextResponse.json(
				{ success: false, message: "replyText and proposerName are required" },
				{ status: 400 },
			);
		}

		const proposalRef = doc(db, "Proposals", proposalId);
		const proposalSnap = await getDoc(proposalRef);

		if (!proposalSnap.exists()) {
			return NextResponse.json(
				{ success: false, message: "Proposal not found" },
				{ status: 404 },
			);
		}

		const proposalData = proposalSnap.data();
		const currentReplies = proposalData.replies || [];

		const newReply = {
			text: replyText,
			proposerName,
			timestamp: new Date(),
		};

		await updateDoc(proposalRef, {
			replies: [...currentReplies, newReply],
			updatedAt: serverTimestamp(),
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error adding proposal reply:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}
