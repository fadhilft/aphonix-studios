import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "order" | "contact";
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subject?: string;
  message?: string;
  productName?: string;
  productPrice?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    
    let subject = "";
    let htmlContent = "";
    
    if (data.type === "order") {
      subject = `🛒 New Order: ${data.productName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00f0ff, #7c3aed); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🛒 New Order Received!</h1>
          </div>
          <div style="padding: 30px; background: #1a1a2e; color: white;">
            <h2 style="color: #00f0ff; border-bottom: 2px solid #00f0ff; padding-bottom: 10px;">Product Details</h2>
            <p><strong>Product:</strong> ${data.productName}</p>
            <p><strong>Price:</strong> ₹${data.productPrice?.toLocaleString()}</p>
            
            <h2 style="color: #00f0ff; border-bottom: 2px solid #00f0ff; padding-bottom: 10px; margin-top: 30px;">Customer Details</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
            <p><strong>Address:</strong> ${data.address || "Not provided"}</p>
          </div>
          <div style="background: #0d0d1a; padding: 20px; text-align: center; color: #888;">
            <p>This order was placed on Aphonix Store</p>
          </div>
        </div>
      `;
    } else {
      subject = `📧 New Inquiry: ${data.subject || "Website Contact"}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00f0ff, #7c3aed); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">📧 New Contact Message!</h1>
          </div>
          <div style="padding: 30px; background: #1a1a2e; color: white;">
            <h2 style="color: #00f0ff; border-bottom: 2px solid #00f0ff; padding-bottom: 10px;">Contact Details</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject || "General Inquiry"}</p>
            
            <h2 style="color: #00f0ff; border-bottom: 2px solid #00f0ff; padding-bottom: 10px; margin-top: 30px;">Message</h2>
            <p style="white-space: pre-wrap; background: #0d0d1a; padding: 15px; border-radius: 8px;">${data.message}</p>
          </div>
          <div style="background: #0d0d1a; padding: 20px; text-align: center; color: #888;">
            <p>This message was sent from Aphonix Studios website</p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Aphonix Studios <onboarding@resend.dev>",
      to: ["aphonixstudios@gmail.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
