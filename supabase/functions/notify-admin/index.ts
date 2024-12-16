import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  artistName: string;
  artistId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { artistName, artistId } = await req.json() as EmailRequest;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AuthenticVoices <onboarding@resend.dev>",
        to: ["admin@authenticvoices.com"], // Replace with actual admin email
        subject: `New Artist Submission: ${artistName}`,
        html: `
          <h1>New Artist Submission</h1>
          <p>A new artist has been submitted for review:</p>
          <p><strong>Name:</strong> ${artistName}</p>
          <p>Please review the submission in the admin dashboard.</p>
          <a href="https://your-app-url.com/admin">Review Submission</a>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in notify-admin function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);