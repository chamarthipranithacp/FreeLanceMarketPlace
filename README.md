# 💼 Freelance Marketplace Platform

A **Full Stack Freelance Marketplace Platform** developed using **Django**, **Django REST Framework**, **HTML**, **CSS**, and **JavaScript**. The platform enables clients to post freelance projects and allows freelancers to browse projects, submit bids, and manage their profiles through a REST API-based architecture.

---

## 📌 Project Overview

The **Freelance Marketplace Platform** is a web application that connects clients and freelancers in a centralized system. It provides secure and efficient management of freelancers, clients, projects, and bids through complete CRUD operations. The backend is built using Django REST Framework, while the frontend is developed with HTML, CSS, and JavaScript.

---

## 🚀 Features

### 👨‍💻 Freelancer Module
- Register Freelancer
- View Freelancer Details
- Update Freelancer Information
- Delete Freelancer Profile

### 👤 Client Module
- Register Client
- View Client Details
- Update Client Information
- Delete Client Profile

### 📂 Project Module
- Create New Projects
- View Available Projects
- Update Project Information
- Delete Projects

### 💰 Bid Module
- Submit Project Bids
- View Submitted Bids
- Update Bid Details
- Delete Bids

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Django
- Django REST Framework

### Database
- SQLite

### Development Tools
- Visual Studio Code
- Postman
- Git
- GitHub

---

## 📁 Project Structure

```text
FreeLanceMarketPlace/
│
├── backend/
│   ├── api/
│   ├── backend/
│   ├── db.sqlite3
│   └── manage.py
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   ├── images/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   └── dashboard.html
│
├── env/
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/chamarthipranithacp/FreeLanceMarketPlace.git
```

### Navigate to the Project Folder

```bash
cd FreeLanceMarketPlace
```

### Create a Virtual Environment

```bash
python -m venv env
```

### Activate the Virtual Environment

**Windows**

```bash
env\Scripts\activate
```

### Install Required Dependencies

```bash
pip install django
pip install djangorestframework
pip install django-cors-headers
```

---

## ▶️ Running the Project

Navigate to the backend folder:

```bash
cd backend
```

Apply database migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

Backend URL:

```
http://127.0.0.1:8000/
```

Open the frontend pages using the **Live Server** extension in Visual Studio Code.

---

## 🔗 REST API Endpoints

### Freelancer APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/freelancers/` | Retrieve all freelancers |
| POST | `/freelancers/add/` | Register a freelancer |
| PUT | `/freelancers/update/<id>/` | Update freelancer details |
| DELETE | `/freelancers/delete/<id>/` | Delete freelancer |

### Client APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients/` | Retrieve all clients |
| POST | `/clients/add/` | Register a client |
| PUT | `/clients/update/<id>/` | Update client details |
| DELETE | `/clients/delete/<id>/` | Delete client |

### Project APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects/` | Retrieve all projects |
| POST | `/projects/add/` | Create a new project |
| PUT | `/projects/update/<id>/` | Update project details |
| DELETE | `/projects/delete/<id>/` | Delete a project |

### Bid APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bids/` | Retrieve all bids |
| POST | `/bids/add/` | Submit a bid |
| PUT | `/bids/update/<id>/` | Update bid details |
| DELETE | `/bids/delete/<id>/` | Delete a bid |

---

# 📷 Project Screenshots

## 🏠 Home Page

<img width="959" height="439" alt="image" src="https://github.com/user-attachments/assets/dc1f5706-29ce-4c6a-97f1-7b7c6bce391c" />


---

## 👨‍💻 Freelancer Registration

<img width="329" height="399" alt="image" src="https://github.com/user-attachments/assets/d59ce8e1-e4b1-4a16-b61a-ac35c23631da" />


---

## 👤 Client Registration

<img width="321" height="401" alt="image" src="https://github.com/user-attachments/assets/d491170f-ab31-44c9-933a-3ceb644bcc2f" />


---

## 📂 Project Management

<img width="692" height="257" alt="image" src="https://github.com/user-attachments/assets/f6fee99e-fe53-4f88-9057-b61a570bdd8e" />


---

## 💰 Bid Management

<img width="742" height="348" alt="image" src="https://github.com/user-attachments/assets/3d0c84d5-4e2c-4721-9890-fe4efc1380f5" />


---


## 💾 Database

The project uses **SQLite** as the database to store:

- Freelancer Information
- Client Information
- Project Details
- Bid Details

---

## 🌟 Future Enhancements

- User Authentication & Authorization
- JWT Authentication
- Email Verification
- Payment Gateway Integration
- Chat Between Client and Freelancer
- Resume & Portfolio Upload
- Advanced Search and Filters
- Responsive UI Design
- Admin Dashboard
- Cloud Deployment (AWS/Render)

---

## 📚 Learning Outcomes

- Built a complete Full Stack Web Application.
- Developed RESTful APIs using Django REST Framework.
- Implemented CRUD operations for multiple modules.
- Connected frontend and backend using JavaScript Fetch API.
- Managed relational data using Django ORM and SQLite.
- Structured a scalable project using industry-standard practices.

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub. Your support is greatly appreciated!
