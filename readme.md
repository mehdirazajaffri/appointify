# Appointify

## Description

Appointify is a Django REST project that allows patients to book appointments with doctors. It provides a user-friendly
interface for patients to search for doctors, view their availability, and book appointments conveniently.

## Features

- User Registration and Authentication: Patients can create an account to access the booking functionality.
  Authentication is required to book appointments and manage user-specific data.
- Doctor Listings: Patients can view a list of available doctors, including their specialization and contact
  information. This helps patients find the right doctor for their needs.
- Appointment Booking: Patients can book an appointment with a doctor of their choice. They can select a preferred date
  and time from the doctor's available time slots.
- Appointment Management: Patients can view a list of their booked appointments. They can also reschedule.
- Doctor Appointment Listings: Doctors can view a list of their upcoming appointments. This helps doctors stay organized
  and manage their schedule effectively, and they can update status of their appointment as well.
- Appointment Confirmation: Doctors can confirm or deny an appointment based on their availability and other factors.
  Patients receive notifications regarding the status of their appointments.

## Installation

1- To set up and run the Appointify project locally, follow these steps:

```bash
  git clone https://github.com/mehdirazajaffri/appointify
```

2- Change to the project directory:

```bash
    cd appointify
```

3- Create Virtual Environment:

```bash
    python -m venv env
```

4- Activate Virtual Environment:

```bash
    source env/bin/activate
```

5- Install dependencies:

```bash
    pip install -r requirements.txt
```

6- Run the migrations:

```bash
    python manage.py migrate
```

7- Create a superuser: to access the admin panel and create doctors and their Time Slots.

```bash
    python manage.py createsuperuser
```

8- Run the server:

```bash
    python manage.py runserver 0.0.0.0:8000
```

Note: You can access the admin panel at http://localhost:8000/admin/

## Run on Docker

```bash
    docker-compose up
```

Note: With Docker, you can access the admin panel at http://localhost/admin/

## API Documentation

- API documentation is available at http://localhost:8000/schema/swagger-ui/
  or https://mehdijaffri.pythonanywhere.com/schema/swagger-ui/
- API documentation is available at http://localhost:8000/schema/redoc/
  or https://mehdijaffri.pythonanywhere.com/schema/redoc/
- You can also download the OpenAPI OAS3 at http://localhost:8000/schema/
  or https://mehdijaffri.pythonanywhere.com/schema/

## Tech Stack

- Python 3.9.5
- Django 3.2.5
- Django REST Framework 3.12.4

## Entity Relationship Diagram (ERD)

![Appointify](https://github.com/mehdirazajaffri/appointify/assets/10342757/1ca00001-3390-405c-9aa0-53506fe541e8)

## Deployed Version

- https://mehdijaffri.pythonanywhere.com/admin/
- https://mehdijaffri.pythonanywhere.com/schema/swagger-ui/

- Super Admin
    - Username: admin
    - Password: Mehdi123
- Patient
    - Username: patient1
    - Password: Mehdi123
- Patient Token can be generated
    - https://mehdijaffri.pythonanywhere.com/schema/swagger-ui/#/Auth%20Token/api_auth_token_create

## Frontend

- The frontend is built with React

``` bash
    cd appointify-ui
```

- Install dependencies:

```bash
    npm install
```

- Run the server:

```bash
    npm start
```

- Build the project:

```bash
    npm run build
```

- Frontend will be available at http://localhost:3000/


### Approach to the project
<small>
To memorize the requirements effectively, I wrote them down on paper. Then, I designed the database and created API models. I also created a normalized version of the database. Despite the tight deadline, I completed all API and admin panel functionalities in 5-6 hours, starting at 7 A.M. I tested and fixed bugs, and added validations like preventing appointments for past dates. Deploying the API on AWS Elastic Beanstalk took longer, so I opted for a free option on pythonanywhere.com, which will keep my Django site active for three months
</small>

### Estimated Time to Complete
<small>
Today was my first day on this project because yesterday was insane at work. I didn't have a moment to breathe! But today, I was all in. I put in a solid 10 hours, no breaks, not even for water. I was totally focused
</small>

### Pending Items
<small>
<li>Front-end is pretty basic, I will work on it later.</li>
<li>I will address the front-end routing issues and switch to using react-router-dom v6.</li>
<li>I haven't written any tests yet. I made a start on the backend, but my main focus was completing the task.</li>
<li>I still need to catch up on the Doctor Status Update call.</li>
</small>

## Contact

If you have any questions, suggestions, or issues, please contact the project maintainer:

- Mehdi Raza (mehdirazajaffri@gmail.com)

## Authors

mehdirazajaffri@gmail.com