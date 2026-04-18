import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json, text/html, */*' },
      // next fetch runs server-side, no CORS restrictions
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream fetch failed: ${res.status}` }, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      // Return raw text (HTML map file etc)
      const text = await res.text();
      return new NextResponse(text, {
        status: 200,
        headers: { 'Content-Type': contentType || 'text/plain' }
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
