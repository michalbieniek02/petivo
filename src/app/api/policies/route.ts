import data from "@/content/policies.json";

export function GET() {
  return Response.json(data, { headers: { "Access-Control-Allow-Origin": "*" } });
}
