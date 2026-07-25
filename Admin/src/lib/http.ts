import { NextResponse } from "next/server";

type Envelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<Envelope<T>>({ success: true, data }, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json<Envelope<never>>(
    { success: false, error: message },
    { status },
  );
}
