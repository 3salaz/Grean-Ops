export const secrets = {
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET || "",
  slackBotToken: process.env.SLACK_BOT_TOKEN || "",
  trelloKey: process.env.TRELLO_API_KEY || "",
  trelloToken: process.env.TRELLO_TOKEN || "",
  githubToken: process.env.GITHUB_TOKEN || "",
  driveServiceAccountEmail: process.env.DRIVE_SA_EMAIL || "",
  driveServiceAccountKey: process.env.DRIVE_SA_KEY || "",
};
