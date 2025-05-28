import { db } from '@/app/firebase/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Update proposal status (for reviewers)
 */
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
        const proposalRef = doc(db, 'Proposals', await params.id);
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

/**
 * Get a single proposal by proposal ID
 */
export async function GET(_, { params }) {
    try {
        const proposalId = await params.id;
        const docSnap = await getDoc(doc(db, 'Proposals', proposalId));
        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Proposal not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({
            success: true,
            proposal: { id: docSnap.id, ...docSnap.data() },
        });
    } catch (error) {
        console.error('Error getting proposal:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

/**
 * Update an existing proposal with new data
 */
export async function PUT(req, { params }) {
    try {
        const proposalId = await params.id;
        const proposalData = await req.json();

        // Remove id before updating
        const { id, ...dataToUpdate } = proposalData;

        const proposalRef = doc(db, 'Proposals', proposalId);
        const currentProposalSnap = await getDoc(proposalRef);
        if (!currentProposalSnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Proposal not found' },
                { status: 404 }
            );
        }

        const currentData = currentProposalSnap.data();

        // Increment version if status changed to "reviewed"
        const version =
            dataToUpdate.status?.toLowerCase() === 'reviewed' &&
            currentData.status?.toLowerCase() !== 'reviewed'
                ? (currentData.version || 1) + 1
                : currentData.version || 1;

        await updateDoc(proposalRef, {
            ...dataToUpdate,
            version,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating proposal:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
