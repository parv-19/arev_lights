type AlertPayload = {
  issueType: string;
  affectedRoute: string;
  possibleCause?: string;
  logs?: string;
};

function getAlertRecipient() {
  return process.env.ALERT_EMAIL_TO || "somani.parv2005@gmail.com";
}

export async function sendProductionAlert(payload: AlertPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn("[ALERTS] Email alert skipped because RESEND_API_KEY or ALERT_EMAIL_FROM is missing.");
    return { success: false, skipped: true };
  }

  const body = {
    from,
    to: [getAlertRecipient()],
    subject: "AREV Lights Production Issue Detected",
    text: [
      `Issue type: ${payload.issueType}`,
      `Affected route: ${payload.affectedRoute}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Possible cause: ${payload.possibleCause || "Unknown"}`,
      `Logs: ${payload.logs || "Not available"}`,
    ].join("\n"),
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send alert email: ${errorText}`);
  }

  return { success: true };
}
