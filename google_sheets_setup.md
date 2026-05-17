# Google Sheets Setup Guide — Brew Haven Cafe

## This connects your website's booking & contact forms to a Google Sheet so you can view all submissions in one place.

---

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Brew Haven — Bookings & Messages"**
4. In **Row 1**, add these column headers:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Form Type | Name | Email | Phone | Date | Time | Guests |

---

## Step 2: Create the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Paste this entire script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var row = [
      data.timestamp || new Date().toLocaleString(),
      data.formType || '',
      data.Name || '',
      data.Email || '',
      data.Phone || '',
      data.Date || '',
      data.Time || '',
      data.Guests || '',
      data.Subject || '',
      data.Message || ''
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (Ctrl+S)
5. Name the project: **"Brew Haven Form Handler"**

---

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon → Select **Web app**
3. Set these options:
   - **Description**: Brew Haven Form Handler
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → Choose your Google account → Allow
6. **Copy the Web App URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`)

---

## Step 4: Add the URL to Your Website

1. Open `script.js` in your website folder
2. Find this line near the top:

```javascript
const GOOGLE_SHEET_URL = ''; 
```

3. Paste your Web App URL between the quotes:

```javascript
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_ID_HERE/exec';
```

4. Save the file

---

## Done! ✅

Now every booking and contact form submission will:
- 📧 **Send an email** to k20287411@gmail.com (via FormSubmit)
- 📊 **Log to Google Sheets** with timestamp, name, email, phone, date, time, guests

You can view all bookings anytime at [sheets.google.com](https://sheets.google.com)!

---

## Notes
- The **first time** someone submits the contact form, FormSubmit will send a confirmation email to verify your email address. Click the link in that email to activate it.
- If you need to update the Apps Script, go to **Deploy → Manage deployments → Edit → New version → Deploy**
