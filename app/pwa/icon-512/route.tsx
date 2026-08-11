import { ImageResponse } from "next/og";
import { PwaIcon } from "@/lib/PwaIcon";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<PwaIcon size={512} />, {
    width: 512,
    height: 512,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
