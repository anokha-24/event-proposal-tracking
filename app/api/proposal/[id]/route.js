import { db } from '@/app/firebase/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
    try {
        const { status, comment, reviewerUid } = await req.json();

        if (!status || !comment || !reviewerUid) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get reviewer info
        const reviewerRef = doc(db, 'Auth', reviewerUid);
        const reviewerSnap = await getDoc(reviewerRef);
        if (!reviewerSnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Reviewer not found' },
                { status: 404 }
            );
        }

        const reviewerInfo = reviewerSnap.data();

        // Get proposal
        const proposalRef = doc(db, 'Proposals', await params.proposalId);
        const proposalSnap = await getDoc(proposalRef);

        if (!proposalSnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Proposal not found' },
                { status: 404 }
            );
        }

        const proposalData = proposalSnap.data();
        const currentComments = proposalData.comments || [];

        const newComment = {
            text: comment,
            reviewerName: reviewerInfo?.name || 'Unknown',
            timestamp: new Date(),
            status,
        };

        await updateDoc(proposalRef, {
            status,
            updatedAt: serverTimestamp(),
            reviewedBy: reviewerUid,
            reviewedAt: serverTimestamp(),
            comments: [...currentComments, newComment],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating proposal status:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
