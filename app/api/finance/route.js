import { NextResponse } from 'next/server';
import { createEmptyData, normalizeFinanceState } from '../../../src/data/defaultData';
import { connectToDatabase } from '../../../src/server/mongodb';
import { FinanceSnapshot } from '../../../src/server/models/FinanceSnapshot';

export const dynamic = 'force-dynamic';

const profileKey = process.env.FINANCE_PROFILE_KEY || 'default';

const upsertState = async (state) =>
  FinanceSnapshot.findOneAndUpdate(
    { profileKey },
    { profileKey, state },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

export async function GET() {
  try {
    await connectToDatabase();

    const existing = await FinanceSnapshot.findOne({ profileKey }).lean();
    if (!existing) {
      const state = createEmptyData();
      await upsertState(state);
      return NextResponse.json({ state });
    }

    return NextResponse.json({ state: normalizeFinanceState(existing.state) });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || 'Unable to load finance data from MongoDB.',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const state = normalizeFinanceState(body?.state || body || createEmptyData());

    await connectToDatabase();
    const saved = await upsertState(state);

    return NextResponse.json({ state: normalizeFinanceState(saved.state) });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || 'Unable to save finance data to MongoDB.',
      },
      { status: 500 }
    );
  }
}
