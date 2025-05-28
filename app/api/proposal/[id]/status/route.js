import { NextRequest, NextResponse } from 'next/server';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    addDoc,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

export async function PUT(req, { params }) {
    const proposalId = await params.id;
    const { newStatus, remarks, userId } = await req.json();

    try {
        const proposalRef = doc(db, 'Proposals', proposalId);
        const proposalSnap = await getDoc(proposalRef);

        if (!proposalSnap.exists()) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        const proposalData = proposalSnap.data();
        let newVersion = proposalData.version || 1;

        if (
            newStatus.toLowerCase() === 'reviewed' &&
            proposalData.status?.toLowerCase() !== 'reviewed'
        ) {
            newVersion += 1;

            const currentComments = proposalData.comments || [];
            const currentReplies = proposalData.replies || [];

            if (currentComments.length || currentReplies.length) {
                await addDoc(collection(db, 'Proposals', proposalId, 'History'), {
                    version: proposalData.version || 1,
                    comments: currentComments,
                    replies: currentReplies,
                    updatedAt: serverTimestamp(),
                    updatedBy: userId,
                });
            }

            await updateDoc(proposalRef, {
                comments: [],
                replies: [],
            });
        }

        await updateDoc(proposalRef, {
            status: newStatus,
            updatedAt: serverTimestamp(),
            version: newVersion,
        });

        if (newStatus.toLowerCase() !== 'reviewed') {
            const proposalForHistory = { ...proposalData };
            delete proposalForHistory.status;
            delete proposalForHistory.version;

            const historyQuery = query(
                collection(db, 'Proposals', proposalId, 'History'),
                where('version', '==', newVersion)
            );
            const historySnapshot = await getDocs(historyQuery);

            if (!historySnapshot.empty) {
                const historyDoc = historySnapshot.docs[0];
                await updateDoc(doc(db, 'Proposals', proposalId, 'History', historyDoc.id), {
                    proposalThread: proposalForHistory,
                    updatedAt: serverTimestamp(),
                    remarks: remarks || `Status updated to ${newStatus}`,
                });
            } else {
                await addDoc(collection(db, 'Proposals', proposalId, 'History'), {
                    proposalThread: proposalForHistory,
                    updatedAt: serverTimestamp(),
                    remarks: remarks || `Status updated to ${newStatus}`,
                    version: newVersion,
                    updatedBy: userId,
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating status:', error);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
