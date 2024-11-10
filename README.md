# Goals Tracker
<!--
Your README.md file should be minimally multiple paragraphs in length, and should provide a comprehensive documentation of what you did and, if applicable, why you did it.

It documents your project thoroughly, and that distinguishes this project from others in the course and defends its complexity.

This section alone should consist of several paragraphs, before you even begin to talk about the documentation of your project.
-->

Goals Tracker is the app that allows the user to focus on getting things done with ease, without all the clutter. It helps the user be accountable in reaching their goals, by incorporating a timeline based on the start date and end date of each goal.


## Distinctiveness and Complexity

I developed `Goals Tracker` because I couldn’t find a goal or habit tracking app that truly helped me stick to my goals until I accomplished them. My biggest struggle was staying consistent, so I needed something neat, user-friendly, and motivating to keep me on track.

This project stands out from my previous ones because it’s not a Social Network app or an E-Commerce site. Instead, it’s focused on productivity and self-improvement. The app is built with four interconnected models and relies heavily on vanilla JavaScript to deliver smooth functionality. While I could have used React, I chose plain JavaScript to make the project more challenging and to better demonstrate my skills. It’s also fully responsive, ensuring it works well on all screen sizes.

`Goals Tracker` is different from regular to-do list apps because it connects long-term goals with daily actions. Users can break down big goals into small, daily tasks and track their progress. This design helps users stay motivated by showing how small steps lead to achieving their big dreams.

The app has several connected parts working together, making it more complex. For instance, the database has models for users, big goals, daily tasks, and a system to track daily completions. These models are linked so that when a user marks a daily task as complete, it updates their overall progress toward their big goals. This required careful planning to make sure everything runs smoothly.

What makes the app unique is its focus on building good habits. The daily task check-in system encourages users to stay consistent, and the timeline view helps them see how far they’ve come. This approach is inspired by productivity and self-improvement principles, which makes it different from most task management tools.

Goals Tracker allows users to:
- Create and delete “big goals.”
- View the status of all “big goals” on the home page.
- See a timeline for each “big goal.”
- Create and delete “daily actions.”
- View and complete “daily actions” linked to their goals.
- Feel secure with user authentication and form validations.
- Enjoy an easy and intuitive experience for managing goals.

A significant amount of effort went into the design and user experience. I used Bootstrap for the structure and custom CSS for styling to create a clean, welcoming interface. The UI was inspired by designs on Dribbble.com and tailored to make users feel comfortable and motivated.

The app’s functionality is powered by three main JavaScript files - `home.js`, `big_goal.js`, and `utils.js` — that handle everything from user interactions to smooth animations. These files work together to deliver a React-like experience, even though I used plain JavaScript.

The backend is built with Django, ensuring secure and reliable handling of user data. PostgreSQL serves as the database, providing efficient data storage and management. All client requests are managed by the backend, making the app robust and efficient.

Finally, Goals Tracker is deployed live on Fly.io, making it accessible and easy to use. It's my first time to deploy a Django app live and I have learned a lot by doing so.

Overall, this app is the result of combining technical skills, design creativity, and a passion for helping people stay consistent with their goals.


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
### Prerequisites

To set up and run the application, ensure you have the following installed:
1. Python 3.10 or later
2. pip (Python package manager)
3. Virtual environment tool (e.g., venv)
4. PostgreSQL (Optional: SQLite can be used for local development without PostgreSQL)

### Getting Started

#### 1. Set Up a Virtual Environment

Set up and activate a virtual environment to isolate dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 2. Install Dependencies

Install all the required Python packages:

```bash
pip install -r requirements.txt
```

#### 3. Configure the Database

The application supports two options for databases:

##### Option 1: Use PostgreSQL (Recommended)
	1.	Install PostgreSQL and create a new database.
	2.	Configure the `.env` file with your PostgreSQL settings:

```bash
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>
```

##### Option 2: Use SQLite (Default)
	1.	SQLite is the fallback database and requires no additional setup.
	2.	Modify the .env file with the following:

DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///db.sqlite3

Note: You can use the provided .env.example file as a template.

#### 4. Apply Database Migrations

Set up the database schema by running:
```bash
python manage.py migrate
```

### 5. Run the Development Server

Start the application server:

```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000 to access the application.