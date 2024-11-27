
function onEdit(e) {
    var sheet = e.source.getSheetByName('Social Media Posts'); 
    var range = e.range;
    
    // Check if the edited cell is in the "Post Status" column (e.g., column 5)
    if (sheet.getName() === 'Social Media Posts' && range.getColumn() === 5) {
      var newValue = range.getValue();
      
      // Run scheduling function if status is set to 'Scheduled'
      if (newValue.toLowerCase() === 'scheduled') {
        scheduleSocialMediaPosts();
      }
    }
  }
  
  
  function scheduleSocialMediaPosts() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Social Media Posts'); 
    var data = sheet.getDataRange().getValues();
    
    var calendarId = '9e38a8c37650cdcc2e8aedfd343d4573d4628742ec228c11ed1de389b70a28b7@group.calendar.google.com'; 
    var calendar = CalendarApp.getCalendarById(calendarId);
  
    // Assuming the first row contains headers
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var platform = row[0]; // Platform
      var contentType = row[1]; // Content Type
      var postContent = row[2]; // Post Content
      var postDate = row[3]; // Post Date
      var postStatus = row[4]; // Post Status
      var file = row[5]; // File
  
      try {
        // Ensure postDate is a Date object
        if (!(postDate instanceof Date)) {
          throw new Error('Invalid Date: ' + postDate);
        }
  
        // Check if Post Status is 'Scheduled'
        if (postStatus.toLowerCase() === 'scheduled') {
          var eventTitle = `Post on ${platform}: ${postContent}`;
          var eventDescription = `Content Type: ${contentType}\nFile: ${file}`;
          
          // Check if event already exists
          var existingEvents = calendar.getEventsForDay(postDate);
          var eventExists = existingEvents.some(function(event) {
            return event.getTitle() === eventTitle;
          });
          
          if (!eventExists) {
            // Create an all-day event without a reminder
            var event = calendar.createAllDayEvent(eventTitle, postDate, {description: eventDescription});
          }
        }
      } catch (e) {
        // Optionally, handle the error if needed
      }
    }
  }
  