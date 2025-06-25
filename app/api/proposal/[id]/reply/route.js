import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { addProposalReply } from "../../../proposalService";

export async function POST(request, { params }) {
	const { id: proposalId } = params;
	const  replyData  = await request.json();

	try {
		const result = await addProposalReply(
			proposalId,
			replyData
		);

		if (result.success) {
			return NextResponse.json({ message: "Reply added successfully" });
		} else {
			return new NextResponse(
				JSON.stringify({ error: result.error || "Failed to add reply" }),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	} catch (error) {
		console.error(`Error adding reply to proposal ${proposalId}:`, error);
		return new NextResponse(
			JSON.stringify({ error: "Failed to add reply" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
