---
layout: post
title:  "How to integrate JIRA and BitBucket application with Rocket.Chat"
excerpt: "Learning how to automatically send notification message from JIRA and BitBucket to Rocket.Chat"
date:   2016-07-15 20:23:00 +0700
categories: web
tags: jira bitbucket rocketchat
image: assets/img/rocketchat-logo.png
---

Rocket.Chat is the best [Slack](https://slack.com/) altenative.

If company also has issue management like [JIRA](https://www.atlassian.com/software/jira) and source code repository management system like [BitBucket](https://www.atlassian.com/software/bitbucket), you can also sending message to Rocket.Chat automatically to easy notify update information about your work progress.

You can see the integration guide from Rocket.Chat documentation.

### Rocket.Chat Documentation

* [Add Jira notifications via WebHook](https://rocket.chat/docs/administrator-guides/integrations/jira)
* [BitRocket](https://rocket.chat/docs/administrator-guides/integrations/bitbucket)

### How to send JIRA notification to Rocket.Chat

#### 1. Create new Bot user

In Rocket.Chat go to "Administration" -> "Users" and create new bot user(Select user role to `Bots`). We will use this user as a sender of JIRA notification. Just make a user like 'jira' and activite it.

#### 2. Create new integration

1. In Rocket.Chat go to "Administration" -> "Integrations" and create "New Integration".
2. Click "Incoming WebHook"
3. Select each option like bellow
    * Enabled : True
    * Name (Optional) : JIRA Notification
    * Post to Channel : /*Input channel which WekHook will be posted*/
    * Post as : /*Input username you already created by step 1*/
    * Script Enabled : True
4. Input Script like [this gist](https://gist.github.com/malko/7b46696aa92d07736cc8ea9ed4041c68)

```javascript
/*jshint  esnext:true*/
const DESC_MAX_LENGTH = 140;
const JIRA_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACRElEQVRYhbWXsUscQRTGf4iIyHHIISIWIsHisMgfkNIiBJFwiKQIkipVqpA/wEZEggSxEkmZwiKI5A84REKKkIMQrINYBQmHBDmEHJdNMW+42dk3d3O76wcDu2/e973vZvfN7EF+PAfaMjYL6AzFJFBRYh0gkdEBpryciuQVwjPgFugCu068CvQcAz1g2pnfEc6taOTGL6dIAjxw5nad+FsnvuhxrosYuPbElrz5Rc8Ucu9yfhcxsAncYZZ4fwTeO+HcUcILWgFqOXg1si9vFBrAXB7iEMySfYQZzGCeWxdoAq+Bh8BYjoJjwn0jWrYrqsOIbdIvUQLseTmPgHXgiYx1ibnYU3RuYpyfKMQ/mNWx+KzkfHHmZ4Tj55zGGNhQiAlw5OQ8VeYbzvxRQCNqUxoHLgMCa07eRyd+4sTXAtwrYCLGAJje1URugLrkVIHvMuyLVZccjfsitrhFMyD0k36bTtA/cOZkTuOckaOTFtA7IgEuSG9ONeBHILctWrnwGNO/mvA3zAk4LddaThfTpoXwKiBuVyL0yxPhloLtAUVCY7us4hb7IxQ/KLu4xWFE8cP7Kg6mld4PKH5BvoNrZBMfBphohKnFMAusyvU48ClgoA3M34eBUynwUu6ngK8BE1Gn3ihYccR79Jd5nuyXsx0rZRo498Q7mK8dMDudZuC8rOLLgQI7Ts5xIGe5DANbinCP9AfmEul/SnZslWHgTBFuKnna8a3lpRCzadSVWMiAj6GPIMbAX+/+H9BS8loyN4ibwX9j/jIXDkk+pgAAAABJRU5ErkJggg==';
function stripDesc(str) {
  if (str)
    return str.length > DESC_MAX_LENGTH ? str.slice(0, DESC_MAX_LENGTH - 3) + '...' : str;
  else
    return '';
}

function prepareAttachment({issue, user}, text) {
  let issueType = issue.fields.issuetype;
  let res = {
    author_name: user.displayName
    , author_icon: user.avatarUrls['24x24']
    , thumb_url: issueType.iconUrl
  };
  if (text) {
    text = text.replace(/\{\{(user|issue)\.([^a-z_0-9]+)\}\}/g, (m, type, key) => (type==='user' ? user : issue)[key]);
    res.text = text;
  }
  return res;
}
class Script {
  process_incoming_request({request}) {
    const data = request.content;
    try {
      if (!data.issue || (data.user && data.user.name === 'gitlab')) {
        return;
      }
      let issue = data.issue;
      let baseJiraUrl = issue.self.replace(/\/rest\/.*$/, '');
      let user = data.user;
      let assignedTo = (issue.fields.assigned && issue.fields.assigned.name !== user.name) ? `, assigned to ${issue.fields.assigned.name}` : '';
      let issueSummary = `[${issue.key}](${baseJiraUrl}/browse/${issue.key}) ${issue.fields.summary} _(${issue.fields.priority.name.replace(/^\s*\d*\.\s*/, '')}${assignedTo})_`;
      let message = {
        icon_url: (issue.fields.project && issue.fields.project.avatarUrls && issue.fields.project.avatarUrls['48x48']) || JIRA_LOGO
        , attachments: []
      };

      if (data.webhookEvent === 'jira:issue_created') {
        message.attachments.push(prepareAttachment(data, `*Created* ${issueSummary}:\n${stripDesc(issue.fields.description)}`));
      } else if (data.webhookEvent === 'jira:issue_deleted') {
        message.attachments.push(prepareAttachment(data, `*Deleted* ${issueSummary}`));
      } else if (data.webhookEvent === 'jira:issue_updated') {
        if (data.changelog && data.changelog.items) { // field update
          let logs = [];
          data.changelog.items.forEach((change) => {
            if (!change.field.match('status|resolution|comment|priority') ) {
              return;
            }
            if (change.field==='description') {
              logs.push(`Changed *description* to:\n${stripDesc(change.toString)}`);
            } else {
              logs.push(`*${change.field}* changed from ${change.fromString} to *${change.toString}*`);
            }
          });
          logs.length && message.attachments.push(prepareAttachment(data, `*Updated* ${issueSummary}:\n  - ${logs.join('\n  - ')}`));
        }

        if (data.comment) { // comment update
          let comment = data.comment;
          let action = comment.created !== comment.updated ? 'Updated comment' : 'Commented';
          message.attachments.push(prepareAttachment(data, `*${action}* on ${issueSummary}:\n${stripDesc(comment.body)}`));
        }
      }

      if (message.text || message.attachments.length) {
        return {content:message};
      }
    } catch(e) {
      console.log('jiraevent error', e);
      return {
        error: {
          success: false,
          message: `${e.message || e} ${JSON.stringify(data)}`
        }
      };
    }
  }
}
```

Press `Save Changes` button and copy `Webhook URL`.

#### 3. Create a WebHook on JIRA 

Go to JIRA as administrator and goto "System" -> "WebHooks" and click "Create a WebHook". Input like this:

* Name : Name of webhook
* Status : Enabled
* URL : Paste webhook url you copied from step 5.
* Event : Check events which you want to send notification message

All done. Your JIRA notifications will be sent to Rocket.Chat.

### How to send BitBucket notification to Rocket.Chat

#### 1. Create new Bot User

Just like the step 1 of JIRA integration, create a new bot user like 'bitbucket'.

#### 2. Create new integration

Same as step 2 of JIRA integration, but use this script to Script section.

* When using BitBucket Cloud : [Click to see](https://github.com/FinndropStudios/BitRocket/blob/master/BBCloud_POSTReceiveHook.js)
* When using BitBucket Server : [Click to see](https://github.com/FinndropStudios/BitRocket/blob/master/BBServer_POSTReceiveHook.js)

Press `Save Changes` button and copy `Webhook URL'.

#### 3. Create a WebHook on BitBucket

BitBucket doesn't have WebHook function basically, But they provide it as add-on.

Got to BitBucket as administrator and goto "Administration" -> "Find new add-ons". Search `Bitbucket Web Post Hooks Plugin` and install it.

BitBucket have to setting hook per repository. Click repository and go to "Settings" -> "Hooks" and click "Post-Receive WebHooks".

Paste `WebHook URL` you copied by step 2.

All done. BitBucket notifications will be sent to Rocket.Chat.