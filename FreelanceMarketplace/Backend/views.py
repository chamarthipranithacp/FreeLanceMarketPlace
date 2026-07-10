from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import db

def parse_json(request):
    try:
        return json.loads(request.body)
    except Exception:
        return None

# ==========================================
# 1. FREELANCER API VIEWS
# ==========================================
@csrf_exempt
def get_freelancers(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = db.get_freelancers()
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_freelancer(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['full_name', 'email', 'phone', 'skills', 'experience', 'hourly_rate']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        f_id = db.add_freelancer(data)
        return JsonResponse({"message": "Freelancer added successfully", "freelancer_id": f_id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_freelancer(request, id):
    if request.method != 'PUT':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['full_name', 'email', 'phone', 'skills', 'experience', 'hourly_rate']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        db.update_freelancer(id, data)
        return JsonResponse({"message": "Freelancer updated successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_freelancer(request, id):
    if request.method != 'DELETE':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        db.delete_freelancer(id)
        return JsonResponse({"message": "Freelancer deleted successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ==========================================
# 2. CLIENT API VIEWS
# ==========================================
@csrf_exempt
def get_clients(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = db.get_clients()
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_client(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['company_name', 'contact_person', 'email', 'phone', 'location']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        c_id = db.add_client(data)
        return JsonResponse({"message": "Client added successfully", "client_id": c_id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_client(request, id):
    if request.method != 'PUT':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['company_name', 'contact_person', 'email', 'phone', 'location']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        db.update_client(id, data)
        return JsonResponse({"message": "Client updated successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_client(request, id):
    if request.method != 'DELETE':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        db.delete_client(id)
        return JsonResponse({"message": "Client deleted successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ==========================================
# 3. PROJECT API VIEWS
# ==========================================
@csrf_exempt
def get_projects(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = db.get_projects()
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_project(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['project_title', 'description', 'category', 'budget', 'deadline', 'client_name']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        p_id = db.add_project(data)
        return JsonResponse({"message": "Project added successfully", "project_id": p_id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_project(request, id):
    if request.method != 'PUT':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['project_title', 'description', 'category', 'budget', 'deadline', 'client_name']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        db.update_project(id, data)
        return JsonResponse({"message": "Project updated successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_project(request, id):
    if request.method != 'DELETE':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        db.delete_project(id)
        return JsonResponse({"message": "Project deleted successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ==========================================
# 4. BID API VIEWS
# ==========================================
@csrf_exempt
def get_bids(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = db.get_bids()
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_bid(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['project_title', 'freelancer_name', 'bid_amount', 'proposal']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        b_id = db.add_bid(data)
        return JsonResponse({"message": "Bid submitted successfully", "bid_id": b_id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_bid(request, id):
    if request.method != 'PUT':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['project_title', 'freelancer_name', 'bid_amount', 'proposal', 'status']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        db.update_bid(id, data)
        return JsonResponse({"message": "Bid updated successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_bid(request, id):
    if request.method != 'DELETE':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        db.delete_bid(id)
        return JsonResponse({"message": "Bid deleted successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ==========================================
# 5. CONTRACT API VIEWS
# ==========================================
@csrf_exempt
def get_contracts(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = db.get_contracts()
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_contract(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['project_title', 'freelancer_name', 'client_name', 'agreed_budget', 'start_date', 'end_date']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        c_id = db.add_contract(data)
        return JsonResponse({"message": "Contract created successfully", "contract_id": c_id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_contract(request, id):
    if request.method != 'PUT':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = parse_json(request)
    required = ['project_title', 'freelancer_name', 'client_name', 'agreed_budget', 'start_date', 'end_date', 'contract_status']
    if not data or not all(k in data for k in required):
        return JsonResponse({"error": "Missing fields"}, status=400)
    try:
        db.update_contract(id, data)
        return JsonResponse({"message": "Contract updated successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_contract(request, id):
    if request.method != 'DELETE':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        db.delete_contract(id)
        return JsonResponse({"message": "Contract deleted successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
