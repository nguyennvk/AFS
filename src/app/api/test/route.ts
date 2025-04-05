import { NextResponse } from 'next/server';
import { AFS_API_URL, AFS_API_KEY } from '../../config';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      apiUrl: AFS_API_URL,
      apiKeyLastFour: AFS_API_KEY ? AFS_API_KEY.slice(-4) : 'none'
    }
  });
} 