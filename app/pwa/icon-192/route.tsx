import { ImageResponse } from "next/og";
import { PwaIcon } from "@/lib/PwaIcon";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<PwaIcon size={192} />, {
    width: 192,
    height: 192,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
