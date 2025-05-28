import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

/**
 * Get proposal history
 */
export async function GET(_req, { params }) {
    const proposalId = await params.id;
    try {
        const q = query(
            collection(db, 'Proposals', proposalId, 'History'),
            orderBy('version', 'desc')
        );
        const snapshot = await getDocs(q);

        const history = snapshot.docs.map((doc) => ({
            id: doc.id,
            version: doc.data().version,
            comments: doc.data().comments || [],
            replies: doc.data().replies || [],
            updatedAt: doc.data().updatedAt,
            updatedBy: doc.data().updatedBy,
        }));

        return NextResponse.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

/**
 * Add an entry to the proposal history
 */
export async function POST(req, { params }) {
    const proposalId = await params.id;
    try {
        const body = await req.json();
        const { userId, ...historyData } = body;

        if (historyData.proposalThread) {
            delete historyData.proposalThread.status;
            delete historyData.proposalThread.version;
        }

        await addDoc(collection(db, 'Proposals', proposalId, 'History'), {
            ...historyData,
            updatedAt: serverTimestamp(),
            updatedBy: userId,
            timestamp: serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding history:', error);
        return NextResponse.json({ error: 'Failed to add history' }, { status: 500 });
    }
}

/**
 * Create or update a history entry when updating a proposal
 */
export async function PUT(req, { params }) {
    const proposalId = await params.id;
    const { proposalData, version } = await req.json();

    try {
        const proposalForHistory = { ...proposalData };
        delete proposalForHistory.status;
        delete proposalForHistory.version;

        const historyQuery = query(
            collection(db, 'Proposals', proposalId, 'History'),
            where('version', '==', version)
        );

        const historySnapshot = await getDocs(historyQuery);

        if (!historySnapshot.empty) {
            const historyDoc = historySnapshot.docs[0];
            await updateDoc(doc(db, 'Proposals', proposalId, 'History', historyDoc.id), {
                proposalThread: proposalForHistory,
                updatedAt: serverTimestamp(),
                remarks: 'Proposal updated',
            });
        } else {
            await addDoc(collection(db, 'Proposals', proposalId, 'History'), {
                proposalThread: proposalForHistory,
                updatedAt: serverTimestamp(),
                remarks: 'Proposal updated',
                version,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating history:', error);
        return NextResponse.json({ error: 'Failed to update history' }, { status: 500 });
    }
}
