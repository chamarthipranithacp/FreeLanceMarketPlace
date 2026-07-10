from pymongo import MongoClient
import os

MONGO_URI = "mongodb+srv://chamarthipranithacp_db_user:Padhu%402005@cluster0.jahnd1x.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client['freelance_db']

def get_next_id(collection_name, id_column, start_val):
    doc = db[collection_name].find_one(sort=[(id_column, -1)])
    if not doc:
        return start_val
    return max(doc[id_column] + 1, start_val)

def init_db():
    # Seed Sample Data if collections are empty
    # 1. Freelancers
    if db.freelancers.count_documents({}) == 0:
        db.freelancers.insert_one({
            "freelancer_id": 101,
            "full_name": "Rahul Sharma",
            "email": "rahul@gmail.com",
            "phone": "9876543210",
            "skills": "MERN Stack, Django",
            "experience": 3,
            "hourly_rate": 20.0
        })
        
    # 2. Clients
    if db.clients.count_documents({}) == 0:
        db.clients.insert_one({
            "client_id": 201,
            "company_name": "Tech Solutions Pvt Ltd",
            "contact_person": "Anjali Verma",
            "email": "client@techsolutions.com",
            "phone": "9988776655",
            "location": "Bangalore"
        })
        
    # 3. Projects
    if db.projects.count_documents({}) == 0:
        db.projects.insert_one({
            "project_id": 301,
            "project_title": "E-Commerce Website",
            "description": "Develop a responsive e-commerce platform.",
            "category": "Web Development",
            "budget": 50000.0,
            "deadline": "2026-08-30",
            "client_name": "Tech Solutions Pvt Ltd"
        })
        
    # 4. Bids
    if db.bids.count_documents({}) == 0:
        db.bids.insert_one({
            "bid_id": 401,
            "project_title": "E-Commerce Website",
            "freelancer_name": "Rahul Sharma",
            "bid_amount": 45000.0,
            "proposal": "I can complete the project in 25 days.",
            "status": "Pending"
        })
        
    # 5. Contracts
    if db.contracts.count_documents({}) == 0:
        db.contracts.insert_one({
            "contract_id": 501,
            "project_title": "E-Commerce Website",
            "freelancer_name": "Rahul Sharma",
            "client_name": "Tech Solutions Pvt Ltd",
            "agreed_budget": 45000.0,
            "start_date": "2026-08-05",
            "end_date": "2026-08-30",
            "contract_status": "Active"
        })

# --- FREELANCER CRUD ---
def get_freelancers():
    return list(db.freelancers.find({}, {"_id": 0}))

def add_freelancer(data):
    f_id = data.get('freelancer_id')
    if not f_id:
        f_id = get_next_id('freelancers', 'freelancer_id', 101)
    
    doc = {
        "freelancer_id": f_id,
        "full_name": data['full_name'],
        "email": data['email'],
        "phone": data['phone'],
        "skills": data['skills'],
        "experience": int(data['experience']),
        "hourly_rate": float(data['hourly_rate'])
    }
    db.freelancers.insert_one(doc)
    return f_id

def update_freelancer(f_id, data):
    db.freelancers.update_one(
        {"freelancer_id": int(f_id)},
        {"$set": {
            "full_name": data['full_name'],
            "email": data['email'],
            "phone": data['phone'],
            "skills": data['skills'],
            "experience": int(data['experience']),
            "hourly_rate": float(data['hourly_rate'])
        }}
    )

def delete_freelancer(f_id):
    db.freelancers.delete_one({"freelancer_id": int(f_id)})

# --- CLIENT CRUD ---
def get_clients():
    return list(db.clients.find({}, {"_id": 0}))

def add_client(data):
    c_id = data.get('client_id')
    if not c_id:
        c_id = get_next_id('clients', 'client_id', 201)
    
    doc = {
        "client_id": c_id,
        "company_name": data['company_name'],
        "contact_person": data['contact_person'],
        "email": data['email'],
        "phone": data['phone'],
        "location": data['location']
    }
    db.clients.insert_one(doc)
    return c_id

def update_client(c_id, data):
    db.clients.update_one(
        {"client_id": int(c_id)},
        {"$set": {
            "company_name": data['company_name'],
            "contact_person": data['contact_person'],
            "email": data['email'],
            "phone": data['phone'],
            "location": data['location']
        }}
    )

def delete_client(c_id):
    db.clients.delete_one({"client_id": int(c_id)})

# --- PROJECT CRUD ---
def get_projects():
    return list(db.projects.find({}, {"_id": 0}))

def add_project(data):
    p_id = data.get('project_id')
    if not p_id:
        p_id = get_next_id('projects', 'project_id', 301)
        
    doc = {
        "project_id": p_id,
        "project_title": data['project_title'],
        "description": data['description'],
        "category": data['category'],
        "budget": float(data['budget']),
        "deadline": data['deadline'],
        "client_name": data['client_name']
    }
    db.projects.insert_one(doc)
    return p_id

def update_project(p_id, data):
    db.projects.update_one(
        {"project_id": int(p_id)},
        {"$set": {
            "project_title": data['project_title'],
            "description": data['description'],
            "category": data['category'],
            "budget": float(data['budget']),
            "deadline": data['deadline'],
            "client_name": data['client_name']
        }}
    )

def delete_project(p_id):
    db.projects.delete_one({"project_id": int(p_id)})

# --- BID CRUD ---
def get_bids():
    return list(db.bids.find({}, {"_id": 0}))

def add_bid(data):
    b_id = data.get('bid_id')
    if not b_id:
        b_id = get_next_id('bids', 'bid_id', 401)
        
    doc = {
        "bid_id": b_id,
        "project_title": data['project_title'],
        "freelancer_name": data['freelancer_name'],
        "bid_amount": float(data['bid_amount']),
        "proposal": data['proposal'],
        "status": data.get('status', 'Pending')
    }
    db.bids.insert_one(doc)
    return b_id

def update_bid(b_id, data):
    db.bids.update_one(
        {"bid_id": int(b_id)},
        {"$set": {
            "project_title": data['project_title'],
            "freelancer_name": data['freelancer_name'],
            "bid_amount": float(data['bid_amount']),
            "proposal": data['proposal'],
            "status": data['status']
        }}
    )

def delete_bid(b_id):
    db.bids.delete_one({"bid_id": int(b_id)})

# --- CONTRACT CRUD ---
def get_contracts():
    return list(db.contracts.find({}, {"_id": 0}))

def add_contract(data):
    c_id = data.get('contract_id')
    if not c_id:
        c_id = get_next_id('contracts', 'contract_id', 501)
        
    doc = {
        "contract_id": c_id,
        "project_title": data['project_title'],
        "freelancer_name": data['freelancer_name'],
        "client_name": data['client_name'],
        "agreed_budget": float(data['agreed_budget']),
        "start_date": data['start_date'],
        "end_date": data['end_date'],
        "contract_status": data.get('contract_status', 'Active')
    }
    db.contracts.insert_one(doc)
    return c_id

def update_contract(c_id, data):
    db.contracts.update_one(
        {"contract_id": int(c_id)},
        {"$set": {
            "project_title": data['project_title'],
            "freelancer_name": data['freelancer_name'],
            "client_name": data['client_name'],
            "agreed_budget": float(data['agreed_budget']),
            "start_date": data['start_date'],
            "end_date": data['end_date'],
            "contract_status": data['contract_status']
        }}
    )

def delete_contract(c_id):
    db.contracts.delete_one({"contract_id": int(c_id)})

# Initialize collection seeding
init_db()
