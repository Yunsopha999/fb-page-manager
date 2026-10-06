import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');

  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
  }

  try {
    let allPages = [];
    let url = `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}&limit=100`;

    // ប្រើ Loop ដើម្បីទាញយក Page ទាំងអស់ទោះបីជាមានច្រើនជាង ២៥ ក៏ដោយ (Pagination)
    while (url) {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        return NextResponse.json({ error: data.error.message }, { status: 400 });
      }

      if (data.data) {
        allPages = [...allPages, ...data.data];
      }

      // ពិនិត្យមើលថាតើមាន Page បន្ទាប់ទៀតដែរឬទេ
      url = data.paging && data.paging.next ? data.paging.next : null;
    }

    return NextResponse.json({ pages: allPages });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}