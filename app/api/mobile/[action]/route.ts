import { NextRequest, NextResponse } from 'next/server';
import { actionRegistry } from '@/lib/services/registry';

// Handle CORS if needed for capacitor local host depending on setup
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Next.js needs this for output: export to skip building dynamic API route
export async function generateStaticParams() {
  return [{ action: 'ping' }];
}

export async function GET() {
  return NextResponse.json({ status: 'ok' }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(
  req: NextRequest,
  // Fix Next.js App Router dynamic type issue by awaiting params in Next 15+
  props: { params: Promise<{ action: string }> } | { params: { action: string } }
) {
  try {
    // Next 15+ sometimes requires awaiting params to prevent sync warn
    const params = await props.params;
    const actionKey = params.action;

    if (!actionKey || !actionRegistry[actionKey]) {
      return NextResponse.json(
        { error: `Action [${actionKey}] not found in registry.` },
        { status: 404, headers: corsHeaders }
      );
    }

    // Try parsing body
    let body = {};
    if (req.headers.get('content-type')?.includes('application/json')) {
      try {
        body = await req.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // body could be empty
      }
    }

    // Execute environment agnostic function
    const actionFunc = actionRegistry[actionKey];
    const result = await actionFunc(body);

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`[Mobile Bridge] Error executing action:`, error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
