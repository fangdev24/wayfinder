import { NextRequest, NextResponse } from 'next/server';

interface FeedbackPayload {
  type: 'bug' | 'feature' | 'general';
  message: string;
  page?: string;
  email?: string;
}

const FEEDBACK_TYPE_EMOJI: Record<string, string> = {
  bug: ':bug:',
  feature: ':bulb:',
  general: ':speech_balloon:',
};

const FEEDBACK_TYPE_LABEL: Record<string, string> = {
  bug: 'Bug Report',
  feature: 'Feature Request',
  general: 'General Feedback',
};

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackPayload = await request.json();

    // Validate required fields
    if (!body.message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!body.type || !['bug', 'feature', 'general'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    // Check for Slack configuration
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackChannel = process.env.SLACK_FEEDBACK_CHANNEL;

    if (!slackToken || !slackChannel) {
      console.warn('Slack feedback not configured - logging to console');
      console.log('FEEDBACK RECEIVED:', body);
      return NextResponse.json({
        success: true,
        message: 'Feedback received (Slack not configured)',
      });
    }

    // Format the Slack message
    const emoji = FEEDBACK_TYPE_EMOJI[body.type];
    const label = FEEDBACK_TYPE_LABEL[body.type];

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} ${label}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: body.message,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: [
              body.page ? `*Page:* ${body.page}` : null,
              body.email ? `*Contact:* ${body.email}` : null,
              `*Time:* ${new Date().toISOString()}`,
            ]
              .filter(Boolean)
              .join(' | '),
          },
        ],
      },
    ];

    // Post to Slack
    const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${slackToken}`,
      },
      body: JSON.stringify({
        channel: slackChannel,
        text: `${emoji} ${label}: ${body.message.substring(0, 100)}...`,
        blocks,
      }),
    });

    const slackResult = await slackResponse.json();

    if (!slackResult.ok) {
      console.error('Slack API error:', slackResult.error);
      return NextResponse.json(
        { error: 'Failed to send feedback to Slack' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback sent successfully',
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
