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
I developed this app because I could not find a goal/habit tracking app or todo list app that focuses on helping me stick to my goals until I accomplish them. My problem was inconsistency in reaching my goals, and I needed an app that was both neat and user-friendly to help me stay on track.

This project is distinct from my previous ones, as it is neither a Social Network app nor an E-Commerce site. The app utilizes more than one model (four in total) and relies heavily on vanilla JavaScript to ensure smooth functionality, similar to React, while maintaining compatibility across all screen sizes.

Goals Tracker helps users manage both big goals and daily tasks, making it different from regular task managers that often focus only on checklists or deadlines. The app is designed to connect big, long-term goals to small, daily actions, helping users track their progress and stay motivated.

The app is complex because it has several connected parts working together. For example, the database includes models for users, big goals, daily tasks, and a system to check off tasks each day. These models are linked together, so when a user updates their daily tasks, their progress toward bigger goals is also updated automatically. Managing these relationships required careful planning to make sure everything stays organized and works correctly.

What makes the app truly unique is its focus on helping users form good habits. The daily task check-in system encourages users to stay consistent, while tracking progress over time helps them see how their small efforts lead to big results. This approach is inspired by productivity and self-improvement principles, setting the app apart from other projects in the course.

Goals Tracker allows users to:
- Create and delete "big goals"
- Determine the status of all "big goals" on the home page
- Visually understand the timeline for each "big goal"
- Create and delete "daily actions"
- View and complete "daily actions" for all "big goals" on the home page
- Feel secure with user authentication and form validations
- Feel at ease with creating, tracking, and completing goals

Initially, I considered using React for smoother functionality and less code, but I decided to use plain vanilla JavaScript to increase the complexity of the project. A significant amount of time was spent on the UI/UX design, drawing inspiration from various project entries on Dribbble.com.

I used Bootstrap CSS for the structure and customized CSS for the details. All elements, such as boxes, modals, and sections, were coded with the intention of making the user feel at home. The app implements three JavaScript files: `home.js`, `big_goal.js`, and `utils.js`. These files work together to ensure smooth functionality for all user requests, making the app more React-like.

All client requests are handled by the Django backend, ensuring robust and secure data management. The app uses PostgreSQL as its database, providing reliable and efficient data storage.

Goals Tracker is deployed live at fly.io, showcasing its functionality and accessibility.


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