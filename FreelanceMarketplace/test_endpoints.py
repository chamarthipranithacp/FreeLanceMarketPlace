import urllib.request
import json
import sys

BASE_URL = 'http://127.0.0.1:8000'

def make_request(url, method='GET', data=None):
    req_url = f"{BASE_URL}{url}"
    req_data = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(req_url, data=req_data, method=method)
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            return response.status, json.loads(res_data) if res_data else {}
    except urllib.error.HTTPError as e:
        res_data = e.read().decode('utf-8')
        try:
            return e.code, json.loads(res_data)
        except Exception:
            return e.code, res_data
    except Exception as e:
        print(f"Connection error to {req_url}: {e}")
        return 0, str(e)

def run_tests():
    print("=" * 60)
    print("RUNNING FREELANCE PLATFORM INTEGRATION TESTS (20 CRUD APIs)")
    print("=" * 60)
    
    success = True
    
    # --- MODULE 1: FREELANCER CRUD ---
    print("\n--- Testing Module 1: Freelancers ---")
    # 1. GET ALL
    status, res = make_request('/freelancers/')
    print(f"[GET] /freelancers/ -> Status: {status}")
    if status != 200: success = False
    
    # 2. POST ADD
    new_freelancer = {
        "full_name": "Integration Test Freelancer",
        "email": "it_free@example.com",
        "phone": "9998887776",
        "skills": "Python, REST APIs",
        "experience": 4,
        "hourly_rate": 30.0
    }
    status, res = make_request('/freelancers/add/', 'POST', new_freelancer)
    print(f"[POST] /freelancers/add/ -> Status: {status}, Response: {res}")
    if status != 201 or 'freelancer_id' not in res:
        success = False
        f_id = 999
    else:
        f_id = res['freelancer_id']
        
    # 3. PUT UPDATE
    new_freelancer['hourly_rate'] = 32.5
    status, res = make_request(f'/freelancers/update/{f_id}/', 'PUT', new_freelancer)
    print(f"[PUT] /freelancers/update/{f_id}/ -> Status: {status}")
    if status != 200: success = False
    
    # 4. DELETE
    status, res = make_request(f'/freelancers/delete/{f_id}/', 'DELETE')
    print(f"[DELETE] /freelancers/delete/{f_id}/ -> Status: {status}")
    if status != 200: success = False


    # --- MODULE 2: CLIENT CRUD ---
    print("\n--- Testing Module 2: Clients ---")
    # 5. GET ALL
    status, res = make_request('/clients/')
    print(f"[GET] /clients/ -> Status: {status}")
    if status != 200: success = False
    
    # 6. POST ADD
    new_client = {
        "company_name": "Integration Test Inc",
        "contact_person": "Jane Doe",
        "email": "it_client@example.com",
        "phone": "8887776665",
        "location": "New York"
    }
    status, res = make_request('/clients/add/', 'POST', new_client)
    print(f"[POST] /clients/add/ -> Status: {status}, Response: {res}")
    if status != 201 or 'client_id' not in res:
        success = False
        c_id = 999
    else:
        c_id = res['client_id']
        
    # 7. PUT UPDATE
    new_client['location'] = "San Francisco"
    status, res = make_request(f'/clients/update/{c_id}/', 'PUT', new_client)
    print(f"[PUT] /clients/update/{c_id}/ -> Status: {status}")
    if status != 200: success = False
    
    # 8. DELETE
    status, res = make_request(f'/clients/delete/{c_id}/', 'DELETE')
    print(f"[DELETE] /clients/delete/{c_id}/ -> Status: {status}")
    if status != 200: success = False


    # --- MODULE 3: PROJECT CRUD ---
    print("\n--- Testing Module 3: Projects ---")
    # 9. GET ALL
    status, res = make_request('/projects/')
    print(f"[GET] /projects/ -> Status: {status}")
    if status != 200: success = False
    
    # 10. POST ADD
    new_project = {
        "project_title": "Integration Test App",
        "description": "Create an API client application",
        "category": "Web Development",
        "budget": 12000.0,
        "deadline": "2026-12-31",
        "client_name": "Integration Test Inc"
    }
    status, res = make_request('/projects/add/', 'POST', new_project)
    print(f"[POST] /projects/add/ -> Status: {status}, Response: {res}")
    if status != 201 or 'project_id' not in res:
        success = False
        p_id = 999
    else:
        p_id = res['project_id']
        
    # 11. PUT UPDATE
    new_project['budget'] = 15000.0
    status, res = make_request(f'/projects/update/{p_id}/', 'PUT', new_project)
    print(f"[PUT] /projects/update/{p_id}/ -> Status: {status}")
    if status != 200: success = False
    
    # 12. DELETE
    status, res = make_request(f'/projects/delete/{p_id}/', 'DELETE')
    print(f"[DELETE] /projects/delete/{p_id}/ -> Status: {status}")
    if status != 200: success = False


    # --- MODULE 4: BID CRUD ---
    print("\n--- Testing Module 4: Bids ---")
    # 13. GET ALL
    status, res = make_request('/bids/')
    print(f"[GET] /bids/ -> Status: {status}")
    if status != 200: success = False
    
    # 14. POST ADD
    new_bid = {
        "project_title": "Integration Test App",
        "freelancer_name": "Integration Test Freelancer",
        "bid_amount": 10000.0,
        "proposal": "I will deliver within 10 days"
    }
    status, res = make_request('/bids/add/', 'POST', new_bid)
    print(f"[POST] /bids/add/ -> Status: {status}, Response: {res}")
    if status != 201 or 'bid_id' not in res:
        success = False
        b_id = 999
    else:
        b_id = res['bid_id']
        
    # 15. PUT UPDATE
    new_bid['status'] = "Accepted"
    status, res = make_request(f'/bids/update/{b_id}/', 'PUT', new_bid)
    print(f"[PUT] /bids/update/{b_id}/ -> Status: {status}")
    if status != 200: success = False
    
    # 16. DELETE
    status, res = make_request(f'/bids/delete/{b_id}/', 'DELETE')
    print(f"[DELETE] /bids/delete/{b_id}/ -> Status: {status}")
    if status != 200: success = False


    # --- MODULE 5: CONTRACT CRUD ---
    print("\n--- Testing Module 5: Contracts ---")
    # 17. GET ALL
    status, res = make_request('/contracts/')
    print(f"[GET] /contracts/ -> Status: {status}")
    if status != 200: success = False
    
    # 18. POST ADD
    new_contract = {
        "project_title": "Integration Test App",
        "freelancer_name": "Integration Test Freelancer",
        "client_name": "Integration Test Inc",
        "agreed_budget": 10000.0,
        "start_date": "2026-07-10",
        "end_date": "2026-12-31"
    }
    status, res = make_request('/contracts/add/', 'POST', new_contract)
    print(f"[POST] /contracts/add/ -> Status: {status}, Response: {res}")
    if status != 201 or 'contract_id' not in res:
        success = False
        con_id = 999
    else:
        con_id = res['contract_id']
        
    # 19. PUT UPDATE
    new_contract['contract_status'] = "Completed"
    status, res = make_request(f'/contracts/update/{con_id}/', 'PUT', new_contract)
    print(f"[PUT] /contracts/update/{con_id}/ -> Status: {status}")
    if status != 200: success = False
    
    # 20. DELETE
    status, res = make_request(f'/contracts/delete/{con_id}/', 'DELETE')
    print(f"[DELETE] /contracts/delete/{con_id}/ -> Status: {status}")
    if status != 200: success = False

    print("\n" + "=" * 60)
    if success:
        print("ALL 20 API CRUD TESTS PASSED SUCCESSFULLY!")
        sys.exit(0)
    else:
        print("SOME TESTS FAILED! Check the output logs above.")
        sys.exit(1)

if __name__ == '__main__':
    run_tests()
