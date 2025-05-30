import { db } from '@/app/firebase/firebase';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// POST /api/proposal/[id]/forward
export async function POST(req, { params }) {
    const proposalId = await params.id;

    try {
        const body = await req.json();
        const parseResult = forwardProposalSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
        }
        const { decision, comments, nextReviewer } = parseResult.data;

        if (!proposalId || !decision || !nextReviewer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (decision != 'approved' && decision != 'rejected') {
            return NextResponse.json(
                { error: 'Decision can only be approved or rejected' },
                { status: 400 }
            );
        }

        const proposalRef = doc(db, 'Proposals', proposalId);
        const proposalSnap = await getDoc(proposalRef);

        if (!proposalSnap.exists()) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        const proposalData = proposalSnap.data();
        const currentReviewer = proposalData.currentReviewer;

        if (!currentReviewer) {
            return NextResponse.json(
                { error: 'Current reviewer info missing in proposal' },
                { status: 400 }
            );
        }

        const historyEntry = {
            ...currentReviewer,
            level: proposalData.level || 1,
            decision,
            comments,
            reviewedAt: serverTimestamp(),
        };

        await updateDoc(proposalRef, {
            reviewerHistory: arrayUnion(historyEntry),
            currentReviewer: { ...nextReviewer },
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error forwarding proposal:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
