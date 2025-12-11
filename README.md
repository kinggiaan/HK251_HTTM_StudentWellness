# Project: Student Wellness Management

# Team:
1. Duong Gia An - 
2. Vo Duong Xuan Nguyen - 
3. Huynh Duc Nham - 2570276

# Deploy (for test at local) tutorial:

## 0. Requirements:
- Python: 3.10+
- NodeJS: v18 or v20

## 1. Backend:

### How to start the project:
- Change directory to backend: `cd ./backend`
- Copy .env.example to .env: `cp .env.example .env`
- Install node modules: `npm install`
- Build the project: `npm run build`
- Start the project (At port 1337): `npm start`

### Create new user with role (Supervisor, Consultant, Data Engineer/Scientist):
- After starting the backend, open browser and navigate to http://localhost:1337/admin
- Login with account:
  + **Email:** huynhducnham@gmail.com
  + **Password:** Nham12345@@
- On the sidebar, navigate to tab **Content manager**
- Select collection type **User**
- Click **Create new entry**
- Fill in the user's information form and **Save**

### Or use existed users with roles:
- supervisor/12345678
- engineer/12345678
- consultant/12345678

## 1. Machine Learning Service:

### How to start the project:
- Change directory to backend: `cd ./ml-service`
- Create virtual python enviroment: `python -m venv venv`
- Access the virtual python enviroment: `source ./venv/bin/activate`
- Install the dependencies: `pip install -r requirements.txt`
- Start the project (At port 8000): `python main.py`