import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

export async function GET(_, context) {
    try {
        const reviewerId = (await context).params.id;

        if (!reviewerId) {
            return NextResponse.json(
                { success: false, message: 'Reviewer ID is required' },
                { status: 400 }
            );
        }

        // Query all proposals where currentReviewer.reviewerId == reviewerId
        const proposalsRef = collection(db, 'Proposals');
        const q = query(proposalsRef, where('currentReviewer.reviewerId', '==', reviewerId));
        const snapshot = await getDocs(q);

        const proposals = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, proposals });
    } catch (error) {
        console.error('Error fetching proposals for reviewer:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch proposals' },
            { status: 500 }
        );
    }
}
