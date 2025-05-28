import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';


/**
 * Get proposals by user ID
 */
export async function GET(_, { params }) {
    try {
        const userId = params.id;
        if (!userId) {
            return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
        }

        const q = query(collection(db, 'Proposals'), where('proposerId', '==', userId), orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const proposals = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, proposals });
    } catch (error) {
        console.error('Error getting proposals by user ID:', error);
        return NextResponse.json({ success: false, error: (error).message }, { status: 500 });
    }
}
