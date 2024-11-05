# Goals Tracker
<!--
Your README.md file should be minimally multiple paragraphs in length, and should provide a comprehensive documentation of what you did and, if applicable, why you did it.

It documents your project thoroughly, and that distinguishes this project from others in the course and defends its complexity.

This section alone should consist of several paragraphs, before you even begin to talk about the documentation of your project.
-->

Goals Tracker is the app that allows the user to focus on getting things done with ease, without all the clutter. It helps the user be accountable in reaching their goals, by incorporating a timeline based on the start date and end date of each goal. 

This project focuses on the consistency of showing up daily to check those goals. 


## Distinctiveness and Complexity
<!-- Why you believe your project satisfies the distinctiveness and complexity requirements, mentioned above. -->
I developed this app because I could not find a goal/habit tracking app or todo list app that focuses on helping me stick to my goals until I acommplish them. That was my problem - I struggled with reaching my goals. I was inconsistent. Part of the issue involves the design of the app I want. It must look neat and very user-friendly.

I believe that reaching your goals shouldn't be complicated or messy. Just focus on what's important, and you'll get there.

This project is distinct from the previous ones I made - not a Social Network app nor an E-Commerce site. It utilizes more than one Model (4 in total), relies heavily on vanilla JavaScript to function smoothly like React, and works well in all screen sizes.

This project is complex because, with simplicity and UI/UX in mind, it must allow the user to:
- create and delete "big goals"
- determine the status of all "big goals" at home page
- visually understand the timeline for each "big goal"
- create and delete "daily actions"
- view and complete "daily actions" for all "big goals" at home page
- feel secured with user authentication and form validations
- feel at ease with creating, tracking, and completing goals 

At first, I considered using React for smooth functionality and lesser code. But doing so won't make it complex, so I decided to simply use plain vanilla JavaScript. Therefore, a great amount of time was spent on the UI/UX. I looked into a lot of different project entries at Dribbble.com for inspiration for the design. 

I used Bootstrap CSS for the structure and customized CSS for the details. All boxes, modals, sections, etc. were coded with the intention to make the user feel home. I implemented 3 JavaScript files: home.js, big_goal.js, and utils.js. All three files work together to ensure smooth functionality with all requests made by the user, making it more React-like. 

All requests made from the client are all handled accordingly in Django backend. 

The database being used is PostgreSQL.

Goals Tracker is deployed live at fly.io.


## Files and directories
<!-- What’s contained in each file you created. -->
- `goals_tracker`: main Django app directory 
  - `static/goals_tracker`
    - `images`: the folder that contains vector and png images
    - `big_goal.js` handles all requests for the big goal page (`big_goal_page.html`)
    - `home.js` handles all requests for the home page (`home_page.html`)
    - `styles.css` contains all customized css
    - `utils.js` contains all customized javascript functions
  - `templates/goals_tracker`
    - `big_goal_page.html`: template to show each big goal; includes the code for the timeline 
    - `home_page.html`: template to show the user dashboard and daily tasks
    - `layout.html`: main template; layout structure
    - `login.html`: template with the login form
    - `register.html`: template with the register form
  - `admin.py` registers models with Django admin interface.
  - `models.py` defines the User, BigGoal, DailySystem, and DailySystemCheckIn models.
  - `urls.py` contains all application URLs (15 in total).
  - `views.py` contains all the necessary and customized application views (14 in total).
- `requirements.txt` contains requirements for the application to run.


## How to run the app
<!-- How to run your application. -->
1. Go to the folder
2. Enter `cd base`
3. Then enter `python manage.py runserver`

The user must begin by creating his personal account using the "Create an account" Form. The user is required to input data into four fields in the form: "username", "email", "password", and "confirm password".

After creating an account, the user will be directed instantly to the Home page. There, the user may now create his first "Big Goal" by clicking the "Add a Big Goal" button. The user is required to input a Title, a Start date, and a Deadline date (a Description is optional). 

After a successfully creating a Big Goal, the user will automatically notice a "Big Goal" box on the Home page containing key details about his newly created Big Goal. 

Upon clicking on the "Big Goal" box, the user will automatically be directed to the "Big Goal" page. There, the user may now view the Timeline starting from the Start date and ending with the Deadline date. The user may now also create Daily Actions by clicking the "Add a Daily Action" button. And if the user desires to delete the "Big Goal", the "Delete Big Goal" is included in the "Big Goal" page.




#### Quick Overview
The app is fairly easy to use. 
It has three main components: 
- Big Goal
- Daily Action
- Timeline

A Big Goal can be any goal the user considers as BIG in that he really wants or needs to make it happen.

A Daily Action is anything that the user needs to do DAILY to reach his Big Goal.

A timeline is needed here to help the user visualize where he currently is. 

#### The Home page
The Home page consists of three sections: the header, the big goal section, and the "tasks today"

#### The "Big Goal" page
The "Big Goal" page consists of ...

#### Login/Register page