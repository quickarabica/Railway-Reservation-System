function searchTrains() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    console.log('Search inputs:', source, destination, date);

    fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination, date })
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
        const results = document.getElementById('results');
        results.innerHTML = '';
        if (!data || data.length === 0) {
            results.innerHTML = '<p>No trains found.</p>';
        } else {
            data.forEach(train => {
                results.innerHTML += `
                    <div>
                        <p>${train.TrainName} (${train.TrainNumber})</p>
                        <p>${train.Source} to ${train.Dest}</p>
                        <p>Dep: ${train.DepartureTime} | Arr: ${train.ArrivalTime}</p>
                        <p>Seats: ${train.TotalSeats}</p>
                        <a href="/booking/${train.ScheduleID}">Book Now</a>
                    </div><hr>`;
            });
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        const results = document.getElementById('results');
        results.innerHTML = '<p>Error fetching trains. Check console for details.</p>';
    });
}