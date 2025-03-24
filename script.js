const API_URL = "https://your-php-backend.com/api.php"; // Ganti dengan URL backend PHP Anda

document.addEventListener('DOMContentLoaded', () => {
    loadRooms();
    
    // Modal functionality
    const modal = document.getElementById('bookingModal');
    const span = document.querySelector('.close');
    
    span.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = "none";
    }
});

async function loadRooms() {
    try {
        const response = await fetch(API_URL);
        const rooms = await response.json();
        
        const container = document.getElementById('rooms');
        container.innerHTML = '';
        
        rooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.className = `room-card ${room.available ? 'available' : 'booked'}`;
            
            roomCard.innerHTML = `
                <h3>${room.type} (${room.id})</h3>
                <p>Price: $${room.price}/night</p>
                <p>Status: ${room.available ? 'Available' : 'Booked'}</p>
                ${room.available ? 
                    `<button onclick="openBookingModal('${room.id}', ${room.price})">Book Now</button>` : 
                    `<button onclick="showBookingDetails('${room.id}')">View Details</button>
                     <button class="cancel-btn" onclick="cancelBooking('${room.id}')">Cancel Booking</button>`
                }
                ${!room.available ? '' : `
                <div class="price-edit">
                    <input type="number" id="price-${room.id}" value="${room.price}">
                    <button onclick="updatePrice('${room.id}')">Update Price</button>
                </div>`}
            `;
            
            container.appendChild(roomCard);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

function openBookingModal(roomId, roomPrice) {
    document.getElementById('modalRoomId').value = roomId;
    document.getElementById('bookingModal').style.display = "block";
}

async function cancelBooking(roomId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'cancel',
                    room_id: roomId
                })
            });
            
            const result = await response.json();
            if (result.status === 'success') {
                alert('Booking cancelled successfully');
                loadRooms();
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    }
}

// Add other functions for booking, updating price, etc.