import { db } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/getAuthUser'; // Create this helper to get user ID from request

export async function GET(req) {
    try {
        const uid = await getAuthUser(req);
        if (!uid) return NextResponse.json({ isReviewer: false }, { status: 401 });

        const userDoc = await getDoc(doc(db, 'Auth', uid));
        const isReviewer = userDoc.exists() && userDoc.data().role === 'Reviewer';

        return NextResponse.json({ isReviewer });
    } catch (error) {
        console.error('Error checking reviewer status:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
