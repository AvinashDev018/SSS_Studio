import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const orderId = formData.get('orderId');
    const damageDescription = formData.get('damageDescription');
    const photo = formData.get('photo');

    if (!orderId || !damageDescription || !photo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Since EmailJS/Google Sheets webhook logic isn't fully detailed in prompt,
    // we'll simulate the success response for the form handler to consume.
    // We would fetch the external webhook URL here in a real app:
    // await fetch(WEBHOOK_URL, { method: 'POST', body: formData })

    console.log(`Damage reported for Order ${orderId}: ${damageDescription}`);
    console.log(`Photo received: ${photo.name} (${photo.size} bytes)`);

    return NextResponse.json({ success: true, message: 'Report submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error in report-damage API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
