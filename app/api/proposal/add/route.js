import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

export async function POST(req) {
    try {
        const proposalData = await req.json();

        // Remove id if exists
        const { id, ...dataToStore } = proposalData;

        // Initialize comments as empty array
        dataToStore.comments = [];

        const docRef = await addDoc(collection(db, 'Proposals'), {
            ...dataToStore,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ success: true, id: docRef.id });
    } catch (error) {
        console.error('Error adding proposal:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
