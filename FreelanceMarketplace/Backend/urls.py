from django.urls import path
from . import views

urlpatterns = [
    # 1. Freelancers
    path('freelancers/add/', views.add_freelancer, name='add_freelancer'),
    path('freelancers/', views.get_freelancers, name='get_freelancers'),
    path('freelancers/update/<int:id>/', views.update_freelancer, name='update_freelancer'),
    path('freelancers/delete/<int:id>/', views.delete_freelancer, name='delete_freelancer'),
    
    # 2. Clients
    path('clients/add/', views.add_client, name='add_client'),
    path('clients/', views.get_clients, name='get_clients'),
    path('clients/update/<int:id>/', views.update_client, name='update_client'),
    path('clients/delete/<int:id>/', views.delete_client, name='delete_client'),
    
    # 3. Projects
    path('projects/add/', views.add_project, name='add_project'),
    path('projects/', views.get_projects, name='get_projects'),
    path('projects/update/<int:id>/', views.update_project, name='update_project'),
    path('projects/delete/<int:id>/', views.delete_project, name='delete_project'),
    
    # 4. Bids
    path('bids/add/', views.add_bid, name='add_bid'),
    path('bids/', views.get_bids, name='get_bids'),
    path('bids/update/<int:id>/', views.update_bid, name='update_bid'),
    path('bids/delete/<int:id>/', views.delete_bid, name='delete_bid'),
    
    # 5. Contracts
    path('contracts/add/', views.add_contract, name='add_contract'),
    path('contracts/', views.get_contracts, name='get_contracts'),
    path('contracts/update/<int:id>/', views.update_contract, name='update_contract'),
    path('contracts/delete/<int:id>/', views.delete_contract, name='delete_contract'),
]
