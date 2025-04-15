# Spec
Portsmouth Joggers' Club (PJC) is a local not-for-profit club of several hundred runners. They organise several races every year.  They have asked for help in building a timing solution for one of these races: the  Pub-to-Pub, scheduled for winter 2025. Your challenge is to build a web-based app capable of timing a race with up to 500 competitors, and sharing the results of this race on the web.

## Existing Solutions
There are already companies which provide race timing (e.g. using RFID tags) but these all have a cost. The club have asked for help in keeping costs down to help maximise the money they can raise for local charities (e.g. Rowans Hospice). They have suggested that the Virtual Volunteer app created by parkrun might be a good example of the kind of simple interface they are hoping for.

## Core Features
### A user must be able to:
 * Start a race timer - x
 * Record the finish time of each runner in that race - x
 * Submit results to a server
 * Clear race results from their device after the race

### The mobile app must be able to:
 * Record race results on a phone that is in "airplane mode" - i.e. offline
 * Store data from one race at a time.
 * Provide timing for races up to 24 hours in length
 * Upload race results to a server (either live during the race and/or as a batch upload afterwards if data is recorded in "airplane mode")

### The server should:
 * Receive data from users
 * Display race results
 * Provide timely results (as data is uploaded or immediately after, so runners can see their official positions and times before they go home).

## Additional Considerations & Features
 * This app will be used outside in winter by older users with imperfect eyesight (and possibly rain on their glasses). It's likely to be cold so they'll have numb fingers or be wearing capacitive gloves. So, build your interface accordingly!
 * We encourage you to think of novel additions and use cases for this app. Advanced features you might consider adding include (but are not limited to):
 * Exporting results to a spreadsheet, possibly using Comma Separated Variable (CSV) format.
 * Share the race start time so other app users around the course can know when to expect the first runners.
 * Provide timing screens at checkpoints and at the finish.
 * Provide a URL for spectators to visit so they can track the face time and finishers.
 * Provide a capability for marshalls at random checkpoints to record the numbers of runners who pass them, the race-time of the event, and the location of the marshall - this can be useful in longer races to provide rigorous evidence of fair race completion by competitors. 

#### Additional Information:
There are many existing apps, tools and videos that implement different aspects of what you're being asked to create. You can refer to these for ideas, just make sure you credit them.
If you'd like to see the Virtual Volunteer app 'in action' parkruns are held in three locations around Portsmouth every Saturday. You can go and watch, or even volunteer, and thereby discover a bit more about what's good and bad about the app.