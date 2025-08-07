let allLeads = [];
let filteredLeads = [];
let currentPage = 1;
let leadsPerPage = 10;
let currentLeadId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadLeads();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Add event listeners for filters
    document.getElementById('searchInput').addEventListener('input', filterLeads);
    document.getElementById('statusFilter').addEventListener('change', filterLeads);
    document.getElementById('cityFilter').addEventListener('change', filterLeads);
    document.getElementById('dateFilter').addEventListener('change', filterLeads);
    
    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
});

async function loadLeads() {
    try {
        console.log('Loading leads...');
        const response = await fetch('/api/admin/leads');
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Received data:', data);
            
            if (data.success) {
                allLeads = data.leads || [];
                console.log('All leads:', allLeads);
                filteredLeads = [...allLeads];
                updateStats();
                renderLeadsTable();
            } else {
                throw new Error(data.message || 'Failed to load leads');
            }
        } else {
            throw new Error('Failed to load leads');
        }
    } catch (error) {
        console.error('Error loading leads:', error);
        alert('Failed to load leads. Please refresh the page.');
    }
}

function updateStats() {
    const today = new Date().toDateString();
    const newToday = allLeads.filter(lead => new Date(lead.created_at).toDateString() === today).length;
    const pendingLeads = allLeads.filter(lead => ['new', 'contacted'].includes(lead.status)).length;
    const highUrgency = allLeads.filter(lead => lead.urgency_level && lead.urgency_level.includes('High')).length;
    
    document.getElementById('totalLeads').textContent = allLeads.length;
    document.getElementById('newToday').textContent = newToday;
    document.getElementById('pendingLeads').textContent = pendingLeads;
    document.getElementById('highUrgency').textContent = highUrgency;
}

function filterLeads() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    filteredLeads = allLeads.filter(lead => {
        // Search filter
        const matchesSearch = !searchTerm || 
            lead.name.toLowerCase().includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm) ||
            (lead.address && lead.address.toLowerCase().includes(searchTerm));
        
        // Status filter
        const matchesStatus = !statusFilter || lead.status === statusFilter;
        
        // City filter
        const matchesCity = !cityFilter || (lead.city && lead.city === cityFilter);
        
        // Date filter
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const leadDate = new Date(lead.created_at);
            const today = new Date();
            
            switch (dateFilter) {
                case 'today':
                    matchesDate = leadDate.toDateString() === today.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = leadDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = leadDate >= monthAgo;
                    break;
            }
        }
        
        return matchesSearch && matchesStatus && matchesCity && matchesDate;
    });
    
    currentPage = 1;
    renderLeadsTable();
}

function renderLeadsTable() {
    const tbody = document.getElementById('leadsTableBody');
    const startIndex = (currentPage - 1) * leadsPerPage;
    const endIndex = startIndex + leadsPerPage;
    const pageLeads = filteredLeads.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    if (pageLeads.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No leads found matching your criteria
                </td>
            </tr>
        `;
    } else {
        pageLeads.forEach(lead => {
            const row = createLeadRow(lead);
            tbody.appendChild(row);
        });
    }
    
    updatePagination();
    updateTableInfo();
}

function createLeadRow(lead) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    const urgencyClass = lead.urgency_level && lead.urgency_level.includes('High') ? 'text-urgency-red-600' : 'text-gray-600';
    const statusClass = getStatusClass(lead.status);
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-trust-blue-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-trust-blue-600">${lead.name.charAt(0).toUpperCase()}</span>
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">${lead.name}</div>
                    <div class="text-sm text-gray-500">${lead.address}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${lead.email}</div>
            <div class="text-sm text-gray-500">${lead.phone}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${lead.city}, ${lead.zip_code}</div>
            <div class="text-sm text-gray-500">${lead.property_type || 'N/A'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                ${lead.status}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm ${urgencyClass}">
            ${lead.urgency_level || 'N/A'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${formatDate(lead.created_at)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="viewLead(${lead.id})" class="text-trust-blue-600 hover:text-trust-blue-900 mr-3">
                <i class="fas fa-eye"></i>
            </button>
            <button onclick="editLead(${lead.id})" class="text-safety-green-600 hover:text-safety-green-900 mr-3">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteLead(${lead.id})" class="text-urgency-red-600 hover:text-urgency-red-900">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return row;
}

function getStatusClass(status) {
    const classes = {
        'new': 'bg-trust-blue-100 text-trust-blue-800',
        'contacted': 'bg-alert-orange-100 text-alert-orange-800',
        'scheduled': 'bg-safety-green-100 text-safety-green-800',
        'inspected': 'bg-trust-blue-100 text-trust-blue-800',
        'closed': 'bg-gray-100 text-gray-800',
        'lost': 'bg-urgency-red-100 text-urgency-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function updatePagination() {
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updateTableInfo() {
    const startIndex = (currentPage - 1) * leadsPerPage + 1;
    const endIndex = Math.min(currentPage * leadsPerPage, filteredLeads.length);
    document.getElementById('tableInfo').textContent = 
        `Showing ${startIndex}-${endIndex} of ${filteredLeads.length} leads`;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderLeadsTable();
    }
}

function viewLead(leadId) {
    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;
    
    const modal = document.getElementById('leadModal');
    const content = document.getElementById('leadModalContent');
    
    content.innerHTML = `
        <div class="grid grid-cols-2 gap-6">
            <div>
                <h4 class="font-semibold text-gray-800 mb-2">Contact Information</h4>
                <p><strong>Name:</strong> ${lead.name}</p>
                <p><strong>Email:</strong> ${lead.email}</p>
                <p><strong>Phone:</strong> ${lead.phone}</p>
                <p><strong>Preferred Contact:</strong> ${lead.preferred_contact || 'N/A'}</p>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800 mb-2">Property Information</h4>
                <p><strong>Address:</strong> ${lead.address}</p>
                <p><strong>City:</strong> ${lead.city}</p>
                <p><strong>Zip Code:</strong> ${lead.zip_code}</p>
                <p><strong>Property Type:</strong> ${lead.property_type || 'N/A'}</p>
                <p><strong>Roof Age:</strong> ${lead.roof_age || 'N/A'}</p>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800 mb-2">Insurance & Urgency</h4>
                <p><strong>Insurance Company:</strong> ${lead.insurance_company || 'N/A'}</p>
                <p><strong>Urgency Level:</strong> ${lead.urgency_level || 'N/A'}</p>
                <p><strong>Status:</strong> ${lead.status}</p>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800 mb-2">Timeline</h4>
                <p><strong>Created:</strong> ${formatDate(lead.created_at)}</p>
                <p><strong>Updated:</strong> ${formatDate(lead.updated_at)}</p>
            </div>
        </div>
        <div class="mt-6">
            <h4 class="font-semibold text-gray-800 mb-2">Notes</h4>
            <textarea id="leadNotes" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg">${lead.notes || ''}</textarea>
        </div>
        <div class="mt-4">
            <h4 class="font-semibold text-gray-800 mb-2">Update Status</h4>
            <select id="leadStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
                <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                <option value="scheduled" ${lead.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                <option value="inspected" ${lead.status === 'inspected' ? 'selected' : ''}>Inspected</option>
                <option value="closed" ${lead.status === 'closed' ? 'selected' : ''}>Closed</option>
                <option value="lost" ${lead.status === 'lost' ? 'selected' : ''}>Lost</option>
            </select>
        </div>
    `;
    
    currentLeadId = leadId;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function editLead(leadId) {
    viewLead(leadId); // Same as view for now, but could be enhanced
}

async function saveLeadChanges() {
    if (!currentLeadId) return;
    
    const notes = document.getElementById('leadNotes').value;
    const status = document.getElementById('leadStatus').value;
    
    try {
        const response = await fetch(`/api/leads/${currentLeadId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, notes })
        });
        
        if (response.ok) {
            // Update local data
            const leadIndex = allLeads.findIndex(l => l.id === currentLeadId);
            if (leadIndex !== -1) {
                allLeads[leadIndex].status = status;
                allLeads[leadIndex].notes = notes;
                allLeads[leadIndex].updated_at = new Date().toISOString();
            }
            
            updateStats();
            filterLeads();
            closeLeadModal();
            alert('Lead updated successfully!');
        } else {
            throw new Error('Failed to update lead');
        }
    } catch (error) {
        console.error('Error updating lead:', error);
        alert('Failed to update lead. Please try again.');
    }
}

async function deleteLead(leadId) {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/leads/${leadId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            allLeads = allLeads.filter(l => l.id !== leadId);
            updateStats();
            filterLeads();
            alert('Lead deleted successfully!');
        } else {
            throw new Error('Failed to delete lead');
        }
    } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Failed to delete lead. Please try again.');
    }
}

function closeLeadModal() {
    const modal = document.getElementById('leadModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    currentLeadId = null;
}

function updateCurrentTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleString();
}

function exportLeads(format) {
    const data = filteredLeads.map(lead => ({
        'Lead ID': lead.id,
        'Name': lead.name,
        'Email': lead.email,
        'Phone': lead.phone,
        'Address': lead.address,
        'City': lead.city,
        'Zip Code': lead.zip_code,
        'Property Type': lead.property_type,
        'Roof Age': lead.roof_age,
        'Insurance Company': lead.insurance_company,
        'Preferred Contact': lead.preferred_contact,
        'Urgency Level': lead.urgency_level,
        'Status': lead.status,
        'Notes': lead.notes,
        'Created': formatDate(lead.created_at),
        'Updated': formatDate(lead.updated_at)
    }));
    
    if (format === 'csv') {
        downloadCSV(data, 'roofing_leads.csv');
    } else if (format === 'excel') {
        downloadExcel(data, 'roofing_leads.xlsx');
    }
}

function downloadCSV(data, filename) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function downloadExcel(data, filename) {
    // For simplicity, we'll create a CSV file with .xlsx extension
    // In a real implementation, you'd use a library like SheetJS
    downloadCSV(data, filename);
}

function generateReport() {
    const report = {
        totalLeads: allLeads.length,
        newToday: allLeads.filter(lead => new Date(lead.created_at).toDateString() === new Date().toDateString()).length,
        byCity: {},
        byStatus: {},
        byUrgency: {}
    };
    
    allLeads.forEach(lead => {
        // By city
        report.byCity[lead.city] = (report.byCity[lead.city] || 0) + 1;
        
        // By status
        report.byStatus[lead.status] = (report.byStatus[lead.status] || 0) + 1;
        
        // By urgency
        const urgency = lead.urgency_level || 'Unknown';
        report.byUrgency[urgency] = (report.byUrgency[urgency] || 0) + 1;
    });
    
    const reportText = `
ROOFING LEADS REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY:
- Total Leads: ${report.totalLeads}
- New Today: ${report.newToday}

BY CITY:
${Object.entries(report.byCity).map(([city, count]) => `- ${city}: ${count}`).join('\n')}

BY STATUS:
${Object.entries(report.byStatus).map(([status, count]) => `- ${status}: ${count}`).join('\n')}

BY URGENCY:
${Object.entries(report.byUrgency).map(([urgency, count]) => `- ${urgency}: ${count}`).join('\n')}
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roofing_report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
} 