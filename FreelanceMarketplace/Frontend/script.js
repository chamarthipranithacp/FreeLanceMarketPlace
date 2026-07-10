const API_BASE = 'http://127.0.0.1:8000';

// Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPageRouter();
});

// Helper: Get Logged In User
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Helper: Show custom notifications
function showAlert(message, type = 'success') {
    const box = document.getElementById('alert-box');
    if (box) {
        box.textContent = message;
        box.className = `alert-box alert-${type}`;
        box.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            box.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Navigation Builder
function initNavigation() {
    const navRight = document.getElementById('nav-right');
    if (!navRight) return;

    const user = getCurrentUser();
    if (user) {
        const isClient = user.role === 'client';
        navRight.innerHTML = `
            <li><a href="dashboard.html" class="${isActivePage('dashboard.html')}">Dashboard</a></li>
            <li><a href="projects.html" class="${isActivePage('projects.html')}">Projects</a></li>
            <li><a href="contracts.html" class="${isActivePage('contracts.html')}">Contracts</a></li>
            <li><span class="pill-role ${isClient ? 'pill-client' : 'pill-freelancer'}">${user.role}</span></li>
            <li><button class="btn btn-secondary" onclick="handleLogout()">Logout (${user.name.split(' ')[0]})</button></li>
        `;
    } else {
        navRight.innerHTML = `
            <li><a href="index.html" class="${isActivePage('index.html')}">Home</a></li>
            <li><a href="login.html" class="${isActivePage('login.html')}">Login</a></li>
            <li><a href="register.html" class="btn btn-primary">Register</a></li>
        `;
    }
}

function isActivePage(filename) {
    return window.location.pathname.endsWith(filename) ? 'active' : '';
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    showAlert("Logged out successfully", "success");
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 8000); // 800ms
    window.location.href = 'index.html';
}

// Page Router - Executes code depending on which HTML page is open
function initPageRouter() {
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        loadHomePageData();
    } else if (path.endsWith('login.html')) {
        initLoginPage();
    } else if (path.endsWith('register.html')) {
        initRegisterPage();
    } else if (path.endsWith('dashboard.html')) {
        initDashboardPage();
    } else if (path.endsWith('projects.html')) {
        initProjectsPage();
    } else if (path.endsWith('bids.html')) {
        initBidsPage();
    } else if (path.endsWith('contracts.html')) {
        initContractsPage();
    }
}

// ==========================================
// 1. HOME PAGE LOGIC
// ==========================================
async function loadHomePageData() {
    // Load Featured Freelancers
    try {
        const res = await fetch(`${API_BASE}/freelancers/`);
        if (res.ok) {
            const freelancers = await res.json();
            const listEl = document.getElementById('featured-freelancers-list');
            if (listEl) {
                listEl.innerHTML = '';
                // Take first 3
                freelancers.slice(0, 3).forEach(f => {
                    listEl.innerHTML += `
                        <div class="card">
                            <h3 style="margin-bottom: 0.5rem;">${f.full_name}</h3>
                            <p style="color: var(--accent-blue); font-weight: 600; margin-bottom: 0.5rem;">${f.skills}</p>
                            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">Experience: ${f.experience} Years</p>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:700;">$${f.hourly_rate}/hr</span>
                                <span class="badge badge-neutral">Freelancer</span>
                            </div>
                        </div>
                    `;
                });
            }
        }
    } catch (e) {
        console.error("Error loading home page freelancers:", e);
    }

    // Load Featured Projects
    try {
        const res = await fetch(`${API_BASE}/projects/`);
        if (res.ok) {
            const projects = await res.json();
            const listEl = document.getElementById('featured-projects-list');
            if (listEl) {
                listEl.innerHTML = '';
                projects.slice(0, 3).forEach(p => {
                    listEl.innerHTML += `
                        <div class="card">
                            <span class="badge badge-neutral" style="margin-bottom: 0.75rem;">${p.category}</span>
                            <h3 style="margin-bottom: 0.5rem;">${p.project_title}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.4;">
                                ${p.description.substring(0, 80)}${p.description.length > 80 ? '...' : ''}
                            </p>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:700; color:var(--accent-green);">$${p.budget}</span>
                                <span style="font-size:0.8rem; color:var(--text-muted);">By ${p.client_name}</span>
                            </div>
                        </div>
                    `;
                });
            }
        }
    } catch (e) {
        console.error("Error loading home page projects:", e);
    }
}

// ==========================================
// 2. LOGIN PAGE LOGIC
// ==========================================
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const role = document.querySelector('input[name="login-role"]:checked').value;
        
        if (!email) {
            showAlert("Please enter your email", "danger");
            return;
        }

        try {
            const endpoint = role === 'freelancer' ? '/freelancers/' : '/clients/';
            const res = await fetch(`${API_BASE}${endpoint}`);
            if (!res.ok) throw new Error("Could not check credentials");
            const users = await res.json();
            
            const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (foundUser) {
                const userSession = {
                    role: role,
                    id: role === 'freelancer' ? foundUser.freelancer_id : foundUser.client_id,
                    email: foundUser.email,
                    name: role === 'freelancer' ? foundUser.full_name : foundUser.company_name,
                    details: foundUser
                };
                localStorage.setItem('currentUser', JSON.stringify(userSession));
                showAlert("Logged in successfully! Redirecting...", "success");
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showAlert("No registered account found with that email address.", "danger");
            }
        } catch (err) {
            showAlert("Login failed: " + err.message, "danger");
        }
    });
}

// ==========================================
// 3. REGISTER PAGE LOGIC
// ==========================================
function initRegisterPage() {
    const regRoleSelect = document.getElementsByName('register-role');
    const freelancerFields = document.getElementById('freelancer-fields');
    const clientFields = document.getElementById('client-fields');
    const registerForm = document.getElementById('register-form');

    if (!registerForm) return;

    // Toggle Form Fields based on Selected Role
    regRoleSelect.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'freelancer') {
                freelancerFields.style.display = 'block';
                clientFields.style.display = 'none';
                // Toggle required fields
                document.getElementById('freelancer-name').required = true;
                document.getElementById('freelancer-skills').required = true;
                document.getElementById('freelancer-experience').required = true;
                document.getElementById('freelancer-rate').required = true;
                
                document.getElementById('client-company').required = false;
                document.getElementById('client-contact').required = false;
                document.getElementById('client-location').required = false;
            } else {
                freelancerFields.style.display = 'none';
                clientFields.style.display = 'block';
                
                document.getElementById('freelancer-name').required = false;
                document.getElementById('freelancer-skills').required = false;
                document.getElementById('freelancer-experience').required = false;
                document.getElementById('freelancer-rate').required = false;
                
                document.getElementById('client-company').required = true;
                document.getElementById('client-contact').required = true;
                document.getElementById('client-location').required = true;
            }
        });
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const role = document.querySelector('input[name="register-role"]:checked').value;
        const email = document.getElementById('register-email').value.trim();
        const phone = document.getElementById('register-phone').value.trim();

        let payload = {};
        let endpoint = '';

        if (role === 'freelancer') {
            payload = {
                full_name: document.getElementById('freelancer-name').value.trim(),
                email: email,
                phone: phone,
                skills: document.getElementById('freelancer-skills').value.trim(),
                experience: parseInt(document.getElementById('freelancer-experience').value),
                hourly_rate: parseFloat(document.getElementById('freelancer-rate').value)
            };
            endpoint = '/freelancers/add/';
        } else {
            payload = {
                company_name: document.getElementById('client-company').value.trim(),
                contact_person: document.getElementById('client-contact').value.trim(),
                email: email,
                phone: phone,
                location: document.getElementById('client-location').value.trim()
            };
            endpoint = '/clients/add/';
        }

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (res.ok) {
                showAlert("Registration successful! Please login.", "success");
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showAlert("Error: " + (result.error || "Registration failed"), "danger");
            }
        } catch (err) {
            showAlert("Network error occurred: " + err.message, "danger");
        }
    });
}

// ==========================================
// 4. DASHBOARD LOGIC
// ==========================================
async function initDashboardPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Toggle Role-based Dashboard Views
    const clientView = document.getElementById('dashboard-client-view');
    const freelancerView = document.getElementById('dashboard-freelancer-view');
    const profileForm = document.getElementById('profile-form');
    
    // Load current profile data into form inputs
    loadProfileInputs(user);

    if (user.role === 'client') {
        clientView.style.display = 'block';
        freelancerView.style.display = 'none';
        document.getElementById('profile-freelancer-fields').style.display = 'none';
        document.getElementById('profile-client-fields').style.display = 'block';
        
        await loadClientDashboardData(user);
    } else {
        clientView.style.display = 'none';
        freelancerView.style.display = 'block';
        document.getElementById('profile-freelancer-fields').style.display = 'block';
        document.getElementById('profile-client-fields').style.display = 'none';
        
        await loadFreelancerDashboardData(user);
    }

    // Handle Profile Update Form Submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let payload = {};
        let endpoint = '';
        
        if (user.role === 'freelancer') {
            payload = {
                full_name: document.getElementById('profile-freelancer-name').value.trim(),
                email: document.getElementById('profile-email').value.trim(),
                phone: document.getElementById('profile-phone').value.trim(),
                skills: document.getElementById('profile-freelancer-skills').value.trim(),
                experience: parseInt(document.getElementById('profile-freelancer-experience').value),
                hourly_rate: parseFloat(document.getElementById('profile-freelancer-rate').value)
            };
            endpoint = `/freelancers/update/${user.id}/`;
        } else {
            payload = {
                company_name: document.getElementById('profile-client-company').value.trim(),
                contact_person: document.getElementById('profile-client-contact').value.trim(),
                email: document.getElementById('profile-email').value.trim(),
                phone: document.getElementById('profile-phone').value.trim(),
                location: document.getElementById('profile-client-location').value.trim()
            };
            endpoint = `/clients/update/${user.id}/`;
        }

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showAlert("Profile updated successfully!", "success");
                // Update LocalStorage Session
                user.name = user.role === 'freelancer' ? payload.full_name : payload.company_name;
                user.email = payload.email;
                user.details = { ...user.details, ...payload };
                localStorage.setItem('currentUser', JSON.stringify(user));
                initNavigation();
                
                // Refresh dashboard listings
                if (user.role === 'client') {
                    await loadClientDashboardData(user);
                } else {
                    await loadFreelancerDashboardData(user);
                }
            } else {
                showAlert("Failed to update profile", "danger");
            }
        } catch (err) {
            showAlert("Error updating profile: " + err.message, "danger");
        }
    });
}

function loadProfileInputs(user) {
    document.getElementById('profile-email').value = user.details.email;
    document.getElementById('profile-phone').value = user.details.phone;

    if (user.role === 'freelancer') {
        document.getElementById('profile-freelancer-name').value = user.details.full_name;
        document.getElementById('profile-freelancer-skills').value = user.details.skills;
        document.getElementById('profile-freelancer-experience').value = user.details.experience;
        document.getElementById('profile-freelancer-rate').value = user.details.hourly_rate;
    } else {
        document.getElementById('profile-client-company').value = user.details.company_name;
        document.getElementById('profile-client-contact').value = user.details.contact_person;
        document.getElementById('profile-client-location').value = user.details.location;
    }
}

// Delete account helper
async function handleDeleteProfile() {
    const user = getCurrentUser();
    if (!user) return;
    if (!confirm("Are you absolutely sure you want to delete your profile? This action is permanent and cannot be undone.")) return;

    try {
        const endpoint = user.role === 'freelancer' ? `/freelancers/delete/${user.id}/` : `/clients/delete/${user.id}/`;
        const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
        if (res.ok) {
            alert("Your profile has been deleted.");
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        } else {
            showAlert("Failed to delete profile", "danger");
        }
    } catch (e) {
        showAlert("Error: " + e.message, "danger");
    }
}

async function loadClientDashboardData(user) {
    try {
        // Fetch all projects, filter those belonging to this client
        const projRes = await fetch(`${API_BASE}/projects/`);
        if (!projRes.ok) throw new Error("Could not load projects");
        const allProjects = await projRes.json();
        const clientProjects = allProjects.filter(p => p.client_name === user.name);

        // Fetch all bids, filter where bid project title is in client's project titles
        const bidRes = await fetch(`${API_BASE}/bids/`);
        if (!bidRes.ok) throw new Error("Could not load bids");
        const allBids = await bidRes.json();
        const projectTitles = clientProjects.map(p => p.project_title.toLowerCase());
        const receivedBids = allBids.filter(b => projectTitles.includes(b.project_title.toLowerCase()));

        // Fetch contracts involving this client name
        const contractRes = await fetch(`${API_BASE}/contracts/`);
        if (!contractRes.ok) throw new Error("Could not load contracts");
        const allContracts = await contractRes.json();
        const clientContracts = allContracts.filter(c => c.client_name === user.name);

        // Render Stats
        document.getElementById('client-stat-projects').textContent = clientProjects.length;
        document.getElementById('client-stat-bids').textContent = receivedBids.length;
        document.getElementById('client-stat-contracts').textContent = clientContracts.filter(c => c.contract_status === 'Active').length;

        // Render My Projects Table
        const projBody = document.getElementById('client-projects-body');
        if (projBody) {
            projBody.innerHTML = '';
            if (clientProjects.length === 0) {
                projBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No projects posted yet.</td></tr>';
            } else {
                clientProjects.forEach(p => {
                    projBody.innerHTML += `
                        <tr>
                            <td><strong>${p.project_id}</strong></td>
                            <td>${p.project_title}</td>
                            <td><span class="badge badge-neutral">${p.category}</span></td>
                            <td>$${p.budget}</td>
                            <td>${p.deadline}</td>
                        </tr>
                    `;
                });
            }
        }

        // Render Received Bids Table with Action buttons
        const bidsBody = document.getElementById('client-bids-body');
        if (bidsBody) {
            bidsBody.innerHTML = '';
            if (receivedBids.length === 0) {
                bidsBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No bids received yet.</td></tr>';
            } else {
                receivedBids.forEach(b => {
                    let actionsHtml = `<span class="badge badge-neutral">${b.status}</span>`;
                    if (b.status === 'Pending') {
                        actionsHtml = `
                            <div class="actions-cell">
                                <button class="btn btn-success" style="padding:0.3rem 0.6rem; font-size:0.8rem;" onclick="handleBidAction(${b.bid_id}, 'Accept', '${b.project_title}', '${b.freelancer_name}', ${b.bid_amount})">Accept</button>
                                <button class="btn btn-danger" style="padding:0.3rem 0.6rem; font-size:0.8rem;" onclick="handleBidAction(${b.bid_id}, 'Reject')">Reject</button>
                            </div>
                        `;
                    }
                    bidsBody.innerHTML += `
                        <tr>
                            <td><strong>${b.bid_id}</strong></td>
                            <td>${b.project_title}</td>
                            <td>${b.freelancer_name}</td>
                            <td>$${b.bid_amount}</td>
                            <td><span style="font-size:0.85rem; color:var(--text-secondary);">${b.proposal}</span></td>
                            <td>${actionsHtml}</td>
                        </tr>
                    `;
                });
            }
        }
    } catch (err) {
        console.error("Dashboard error:", err);
    }
}

async function handleBidAction(bidId, action, projectTitle = '', freelancerName = '', bidAmount = 0) {
    const user = getCurrentUser();
    if (!user) return;

    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this bid?`)) return;

    try {
        // Fetch original bid details
        const res = await fetch(`${API_BASE}/bids/`);
        if (!res.ok) throw new Error("Bids check failed");
        const bids = await res.json();
        const bid = bids.find(b => b.bid_id === bidId);
        if (!bid) throw new Error("Bid not found");

        if (action === 'Accept') {
            // Update selected bid status to Accepted
            bid.status = 'Accepted';
            let updateRes = await fetch(`${API_BASE}/bids/update/${bidId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bid)
            });
            if (!updateRes.ok) throw new Error("Failed to accept bid");

            // Automatically create a Contract
            const todayStr = new Date().toISOString().split('T')[0];
            
            // Set end date to +30 days as default or project date
            const end = new Date();
            end.setDate(end.getDate() + 30);
            const endStr = end.toISOString().split('T')[0];

            const contractPayload = {
                project_title: projectTitle,
                freelancer_name: freelancerName,
                client_name: user.name,
                agreed_budget: bidAmount,
                start_date: todayStr,
                end_date: endStr,
                contract_status: 'Active'
            };

            const contractRes = await fetch(`${API_BASE}/contracts/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contractPayload)
            });
            if (!contractRes.ok) throw new Error("Bid accepted, but failed to auto-create contract");

            // Reject all other bids on the same project
            const otherBids = bids.filter(b => b.project_title.toLowerCase() === projectTitle.toLowerCase() && b.bid_id !== bidId && b.status === 'Pending');
            for (let ob of otherBids) {
                ob.status = 'Rejected';
                await fetch(`${API_BASE}/bids/update/${ob.bid_id}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ob)
                });
            }

            showAlert("Bid Accepted! Contract auto-created successfully.", "success");
        } else {
            // Reject Bid
            bid.status = 'Rejected';
            let updateRes = await fetch(`${API_BASE}/bids/update/${bidId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bid)
            });
            if (!updateRes.ok) throw new Error("Failed to reject bid");
            showAlert("Bid rejected successfully", "warning");
        }

        // Reload data
        await loadClientDashboardData(user);
    } catch (e) {
        showAlert("Bid Action Error: " + e.message, "danger");
    }
}

async function loadFreelancerDashboardData(user) {
    try {
        // Fetch all bids, filter those submitted by this freelancer name
        const bidRes = await fetch(`${API_BASE}/bids/`);
        if (!bidRes.ok) throw new Error("Could not load bids");
        const allBids = await bidRes.json();
        const myBids = allBids.filter(b => b.freelancer_name.toLowerCase() === user.name.toLowerCase());

        // Fetch contracts involving this freelancer name
        const contractRes = await fetch(`${API_BASE}/contracts/`);
        if (!contractRes.ok) throw new Error("Could not load contracts");
        const allContracts = await contractRes.json();
        const myContracts = allContracts.filter(c => c.freelancer_name.toLowerCase() === user.name.toLowerCase());

        // Render Stats
        document.getElementById('free-stat-applied').textContent = myBids.length;
        document.getElementById('free-stat-contracts').textContent = myContracts.filter(c => c.contract_status === 'Active').length;
        document.getElementById('free-stat-earnings').textContent = '$' + myContracts
            .filter(c => c.contract_status === 'Completed')
            .reduce((sum, c) => sum + c.agreed_budget, 0);

        // Render My Bids Table
        const bidsBody = document.getElementById('free-bids-body');
        if (bidsBody) {
            bidsBody.innerHTML = '';
            if (myBids.length === 0) {
                bidsBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No bids submitted yet.</td></tr>';
            } else {
                myBids.forEach(b => {
                    let badgeClass = 'badge-pending';
                    if (b.status === 'Accepted') badgeClass = 'badge-accepted';
                    if (b.status === 'Rejected') badgeClass = 'badge-rejected';
                    
                    bidsBody.innerHTML += `
                        <tr>
                            <td><strong>${b.bid_id}</strong></td>
                            <td>${b.project_title}</td>
                            <td>$${b.bid_amount}</td>
                            <td><span style="font-size:0.85rem; color:var(--text-secondary);">${b.proposal}</span></td>
                            <td><span class="badge ${badgeClass}">${b.status}</span></td>
                        </tr>
                    `;
                });
            }
        }
    } catch (e) {
        console.error("Freelancer Dashboard error:", e);
    }
}

// ==========================================
// 5. PROJECTS PAGE LOGIC
// ==========================================
let allProjectsData = [];

async function initProjectsPage() {
    const user = getCurrentUser();
    const postProjCard = document.getElementById('post-project-card');
    
    // Toggle Project Posting access
    if (user && user.role === 'client') {
        if (postProjCard) postProjCard.style.display = 'block';
        initProjectPostForm(user);
    } else {
        if (postProjCard) postProjCard.style.display = 'none';
    }

    // Load available projects
    await loadProjectsList(user);

    // Bind search and filter events
    const searchInput = document.getElementById('search-project');
    const filterCategory = document.getElementById('filter-category');

    if (searchInput) {
        searchInput.addEventListener('input', applyProjectFilters);
    }
    if (filterCategory) {
        filterCategory.addEventListener('change', applyProjectFilters);
    }
}

function initProjectPostForm(user) {
    const form = document.getElementById('post-project-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            project_title: document.getElementById('proj-title').value.trim(),
            description: document.getElementById('proj-desc').value.trim(),
            category: document.getElementById('proj-cat').value,
            budget: parseFloat(document.getElementById('proj-budget').value),
            deadline: document.getElementById('proj-deadline').value,
            client_name: user.name
        };

        try {
            const res = await fetch(`${API_BASE}/projects/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showAlert("Project posted successfully!", "success");
                form.reset();
                await loadProjectsList(user);
            } else {
                const err = await res.json();
                showAlert("Failed to post project: " + (err.error || "Unknown error"), "danger");
            }
        } catch (e) {
            showAlert("Connection error: " + e.message, "danger");
        }
    });
}

async function loadProjectsList(user) {
    try {
        const res = await fetch(`${API_BASE}/projects/`);
        if (!res.ok) throw new Error("Could not fetch projects list");
        allProjectsData = await res.json();
        renderProjects(allProjectsData, user);
    } catch (e) {
        showAlert("Error loading projects: " + e.message, "danger");
    }
}

function renderProjects(projects, user) {
    const listEl = document.getElementById('projects-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    if (projects.length === 0) {
        listEl.innerHTML = '<div class="card" style="text-align:center; color:var(--text-muted); grid-column: 1/-1;">No projects match your filters.</div>';
        return;
    }

    projects.forEach(p => {
        let bidButton = '';
        if (user && user.role === 'freelancer') {
            bidButton = `
                <button class="btn btn-primary" onclick="goToBidPage('${encodeURIComponent(p.project_title)}')">Submit Bid</button>
            `;
        } else if (!user) {
            bidButton = `
                <a href="login.html" class="btn btn-secondary">Login to Bid</a>
            `;
        }

        listEl.innerHTML += `
            <div class="card">
                <span class="badge badge-neutral" style="margin-bottom: 0.75rem;">${p.category}</span>
                <h3 style="margin-bottom: 0.5rem;">${p.project_title}</h3>
                <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5;">
                    ${p.description}
                </p>
                <div style="border-top:1px solid var(--border-card); padding-top:1rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-weight:800; color:var(--accent-green); font-size:1.15rem;">$${p.budget}</span>
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">Deadline: ${p.deadline}</div>
                    </div>
                    ${bidButton}
                </div>
            </div>
        `;
    });
}

function applyProjectFilters() {
    const user = getCurrentUser();
    const query = document.getElementById('search-project').value.toLowerCase().trim();
    const cat = document.getElementById('filter-category').value;

    let filtered = allProjectsData;

    if (query) {
        filtered = filtered.filter(p => 
            p.project_title.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
        );
    }

    if (cat) {
        filtered = filtered.filter(p => p.category === cat);
    }

    renderProjects(filtered, user);
}

function goToBidPage(projectTitle) {
    window.location.href = `bids.html?project=${projectTitle}`;
}

// ==========================================
// 6. BIDS PAGE LOGIC
// ==========================================
function initBidsPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'freelancer') {
        showAlert("Only logged-in Freelancers can submit bids.", "danger");
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pTitle = decodeURIComponent(urlParams.get('project') || '');
    
    if (pTitle) {
        document.getElementById('bid-project-title').value = pTitle;
    }

    const form = document.getElementById('submit-bid-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            project_title: document.getElementById('bid-project-title').value.trim(),
            freelancer_name: user.name,
            bid_amount: parseFloat(document.getElementById('bid-amount').value),
            proposal: document.getElementById('bid-proposal').value.trim(),
            status: 'Pending'
        };

        try {
            const res = await fetch(`${API_BASE}/bids/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showAlert("Bid proposal submitted successfully!", "success");
                form.reset();
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);
            } else {
                showAlert("Failed to submit bid", "danger");
            }
        } catch (e) {
            showAlert("Error: " + e.message, "danger");
        }
    });
}

// ==========================================
// 7. CONTRACTS PAGE LOGIC
// ==========================================
let allContractsData = [];

async function initContractsPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    await loadContractsList(user);
}

async function loadContractsList(user) {
    try {
        const res = await fetch(`${API_BASE}/contracts/`);
        if (!res.ok) throw new Error("Could not fetch contracts list");
        allContractsData = await res.json();
        
        // Filter contracts that belong to this user
        let userContracts = [];
        if (user.role === 'client') {
            userContracts = allContractsData.filter(c => c.client_name.toLowerCase() === user.name.toLowerCase());
        } else {
            userContracts = allContractsData.filter(c => c.freelancer_name.toLowerCase() === user.name.toLowerCase());
        }
        
        renderContracts(userContracts, user);
    } catch (e) {
        showAlert("Error loading contracts: " + e.message, "danger");
    }
}

function renderContracts(contracts, user) {
    const bodyEl = document.getElementById('contracts-body');
    if (!bodyEl) return;

    bodyEl.innerHTML = '';
    if (contracts.length === 0) {
        bodyEl.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No active agreements or contracts.</td></tr>';
        return;
    }

    contracts.forEach(c => {
        let badgeClass = 'badge-neutral';
        if (c.contract_status === 'Active') badgeClass = 'badge-active';
        if (c.contract_status === 'Completed') badgeClass = 'badge-completed';
        if (c.contract_status === 'Cancelled') badgeClass = 'badge-cancelled';

        // Actions: Show complete/cancel button for matching client/freelancer
        let actionsHtml = '';
        if (c.contract_status === 'Active') {
            actionsHtml = `
                <div class="actions-cell">
                    <button class="btn btn-success" style="padding:0.3rem 0.6rem; font-size:0.8rem;" onclick="updateContractStatus(${c.contract_id}, 'Completed')">Complete</button>
                    <button class="btn btn-danger" style="padding:0.3rem 0.6rem; font-size:0.8rem;" onclick="updateContractStatus(${c.contract_id}, 'Cancelled')">Cancel</button>
                </div>
            `;
        } else {
            actionsHtml = `
                <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.8rem; border-color:rgba(239, 68, 68, 0.2); color:var(--accent-red);" onclick="deleteContract(${c.contract_id})">Delete</button>
            `;
        }

        bodyEl.innerHTML += `
            <tr>
                <td><strong>#${c.contract_id}</strong></td>
                <td>${c.project_title}</td>
                <td>${user.role === 'client' ? c.freelancer_name : c.client_name}</td>
                <td><strong>$${c.agreed_budget}</strong></td>
                <td>${c.start_date}</td>
                <td>${c.end_date}</td>
                <td><span class="badge ${badgeClass}">${c.contract_status}</span></td>
                <td>${actionsHtml}</td>
            </tr>
        `;
    });
}

async function updateContractStatus(contractId, status) {
    const user = getCurrentUser();
    if (!user) return;

    if (!confirm(`Are you sure you want to mark this contract as ${status.toLowerCase()}?`)) return;

    try {
        const contract = allContractsData.find(c => c.contract_id === contractId);
        if (!contract) throw new Error("Contract not found");
        
        contract.contract_status = status;

        const res = await fetch(`${API_BASE}/contracts/update/${contractId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contract)
        });
        if (res.ok) {
            showAlert(`Contract status updated to ${status}!`, "success");
            await loadContractsList(user);
        } else {
            showAlert("Failed to update contract status", "danger");
        }
    } catch (e) {
        showAlert("Error: " + e.message, "danger");
    }
}

async function deleteContract(contractId) {
    const user = getCurrentUser();
    if (!user) return;

    if (!confirm("Are you sure you want to delete this contract from history?")) return;

    try {
        const res = await fetch(`${API_BASE}/contracts/delete/${contractId}/`, {
            method: 'DELETE'
        });
        if (res.ok) {
            showAlert("Contract deleted successfully", "success");
            await loadContractsList(user);
        } else {
            showAlert("Failed to delete contract", "danger");
        }
    } catch (e) {
        showAlert("Error: " + e.message, "danger");
    }
}
