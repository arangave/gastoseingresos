import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    return NextResponse.json({ token: "fake-jwt-token" }, { status: 201 });
}
