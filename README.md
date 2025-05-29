# Race Control - by UP2118183
Race Control is a full stack, web based application designed for any runner competing in a [*Backyard Ultra*](https://en.wikipedia.org/wiki/Backyard_ultra) to record and view their results in a timely manner, as well as enable volunteers to administer disqualifications and corrections easily.

> Some values have been intentionally left inside /database.sql in order to show [Key features](#key-features) at work.

> Please consider using `{ username: admin, password: admin }` if youd like to see the admin functionality in action.

#### Resources used in this project
This list is not conclusive, as information was also garnered from various stack overflow threads, discussion pages and university resources.
- [***Github (portsoc)***](https://github.com/portsoc)
- [***Node.js***](https://nodejs.org/docs/latest/api/)
- [***Express.js***](https://expressjs.com/)
- [***MDN Web Docs***](https://developer.mozilla.org/en-US/)
- [***SQLite.org***](https://sqlite.org/docs.html)
- [***markdownguide.org***](https://www.markdownguide.org/cheat-sheet/)

## Assumptions
All assumptions of logic and/ or  physical race organisation will be mentioned here.

A1: 
- Each runner can at least access the internet at least twice before they leave the premises of the race (once to enter, once to submit all results).

A2:
- There will be at least one volunteer at each race to tell runners to exit the track upon being disqualified, and to announce the winner to all participants

A3: 
- This volunteer can also access the internet at least once, in order to manage the race effectively and announce winners/ disqualify runners using a stopwatch.

A4:
- Both the runners and volunteer(s) are sportsmanlike, and not destructive/ malicious to the races integrity or organisation.

## Key features: 

### Real Time Lap Tracking
- Accurately times the runners lap through the use of connected callbacks.
- The runners lap timings can either be uploaded 1 by 1 if connected to the internet, or uploaded as a batch when they next connect to the internet through the use of localStorage.
- When recording a lap result, the relevant buttons and inputs are 'hidden' to avoid accidentally submitting results or 'fat fingering' the pause button mid-run.

### Dashboard 
- This uses dynamic text, addressing the user with their username in welcome messages.
- This acts as a landing pad for the user to progress to other functionality such as Racing, Spectating or Viewing Account Details

### Race Finding
- By querying the database with the user's input search parameters, a list of 'Like' results are displayed, offering the user to either enter that race as a runner, or view the race's ongoing lap results as a spectator.

### Spectating A Race
- An example of this feature in action can be seen by following these instructions:
  1. login or register an account
  2. click the `'spectate race'` card
  3. enter `city` into the search bar, 'Abington Park: City marathon' will be the first result
  4. press the `Spectate Race` button (right side).
  5. View the results by lap, and refresh if any errors occur

### Admin Privileges
- Upon accessing the account page as an admin, a hidden admin portal is loaded to the screen, allowing only trusted admins to query the database, with the exception of ['DELETE', 'ALTER', 'DROP'].
- The intention of this is to allow volunteers to interpret specific data, such as the winner of a race, or note the details of a runner who is submitting unsportsmanlike results


## AI

While generative AI (chatGPT) was used in the development of this project, all code in this project is built by me and not just copied over from a AI prompt saying ***'build me x, y, z'***.

The majority of my AI usage consisted of asking syntax specific questions for the allowed third-party resources used here ([express.js](https://expressjs.com/) and [sqlite](https://sqlite.org)), with this being heavily supplemented by reading the documentation for both of these libraries when needed.

---
### Prompts to develop /database
Before this, I assumed that sqlite would be a lot closer in syntax to postgreSQL and mostly used AI to correct my presumptions going into this portion of development.

> Im familiar with pSQL but not sqlite, why cant i use SERIAL for my primary keys?

This response proved useless due to its vagueness, so i read the sqlite documentation and found that I needed to use `INTEGER PRIMARY KEY AUTOINCREMENT` instead.

> Im trying to use my query's results in my frontend, what does express and sqlite return my db results as?

After learning that the result of a fetch is an array of database rows as objects, i was able to use my data far more proficiently.


>  Does using `longrowname AS name` set the objects key to that value?

Since AS changed the header name of a selected column in pSQL, the fact that this changed the 'header' (key) in sqlite was immensely useful. 
I then went on to construct a view using `AS` that was crucial to this app's development.

---
### Prompts to develop /svr.js
For my express server, the majority of my prompting was to further my understanding of topics like sessions, cookies and dynamic pathing (e.g. `'/api/lap-results/:id'`) as this was the major hurdle i overcame in this area.

>  Can you explain these session parameters line by line?: (pasted in the session parameters from [**this**](https://expressjs.com/en/resources/middleware/session.html))

This response was useful, and upon heavy reading of the documentation and other online pages I managed to understand and begin my implementation of sessions.

This then led me to discover the role of cookies in the web with many CORS errors stemming from my fetch requests and missing authentication.

This error proved annoyingly persistent for me, with AI prompts proving uninformative i sat and read the `express-session` documentation to no avail. I then miraculously found the answer in [this](https://stackoverflow.com/questions/13426800/express-session-not-persisting?rq=4) stack overflow thread (second answer), and by simply using `credentials: 'include'` in my fetch requests my issue was completely solved, which was as rewarding as you can imagine.

---
### Prompts to develop my custom elements
Again, the prompts here were mainly for syntax differences as I have used pure js objects in an earlier module this year.

> explain the use of a connectedCallback function please?

This response solved my problem, as my `showElement()` function was being called twice unnecessarily due to improper use.

After implementing a check using the `.hasChildNodes()` method my problem was solved and functioned as intended

> Im trying to attach an event listener in the shadowDOM, but `.addEventListener()` isnt working?

I then discovered and read about the `.bind(this)` method required for this operation. After implementing this I had no issues with attaching listeners to my custom elements for the rest of the project.

---