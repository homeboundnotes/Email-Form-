/**
 * Google Apps Script for Homebound Email Collection
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Save the project (give it a name like "Homebound Email Collector")
 * 5. Deploy as a web app (see instructions below)
 */

function doPost(e) {
  try {
    // Get the active spreadsheet (or create one)
    let sheet = getOrCreateSheet();
    
    // Parse the form data
    const email = e.parameter.email;
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const source = e.parameter.source || 'unknown';
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Invalid email'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check if email already exists
    const existingEmails = sheet.getRange('A:A').getValues().flat();
    if (existingEmails.includes(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Email already subscribed'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add the new row
    sheet.appendRow([
      email,
      timestamp,
      source,
      new Date().toLocaleString()
    ]);
    
    // Optional: Send yourself a notification email
    sendNotificationEmail(email, timestamp);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Email added successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const spreadsheetName = 'Homebound Email Subscribers';
  
  // Try to find existing spreadsheet
  const files = DriveApp.getFilesByName(spreadsheetName);
  let spreadsheet;
  
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    // Create new spreadsheet
    spreadsheet = SpreadsheetApp.create(spreadsheetName);
  }
  
  let sheet = spreadsheet.getActiveSheet();
  
  // Set up headers if this is a new sheet
  if (sheet.getLastRow() === 0) {
    sheet.getRange('A1:D1').setValues([['Email', 'Timestamp', 'Source', 'Date Added']]);
    sheet.getRange('A1:D1').setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 4);
  }
  
  return sheet;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sendNotificationEmail(email, timestamp) {
  try {
    // Replace with your email address
    const notificationEmail = 'reachhomebound@gmail.com';
    
    const subject = 'New Homebound Subscription';
    const body = `
New email subscription received:

Email: ${email}
Time: ${new Date(timestamp).toLocaleString()}
Source: Homebound Landing Page

View all subscribers: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
    `;
    
    MailApp.sendEmail(notificationEmail, subject, body);
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
}

// Test function (optional)
function testScript() {
  const testEvent = {
    parameter: {
      email: 'test@example.com',
      timestamp: new Date().toISOString(),
      source: 'test'
    }
  };
  
  const result = doPost(testEvent);
  console.log(result.getContent());
}